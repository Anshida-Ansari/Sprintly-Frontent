import { useEffect, useRef, useState, useCallback } from 'react';
import { socket } from '../../../lib/socket';

interface PeerConnection {
    connection: RTCPeerConnection;
    socketId: string;
}

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export function useWebRTC(roomId: string, userId: string) {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
    const peers = useRef<Record<string, PeerConnection>>({});

    const initLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            return stream;
        } catch (err) {
            console.error('Error accessing media devices:', err);
            return null;
        }
    }, []);

    const createPeerConnection = useCallback((targetSocketId: string, stream: MediaStream) => {
        const pc = new RTCPeerConnection(configuration);

        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { roomId, to: targetSocketId, candidate: event.candidate });
            }
        };

        pc.ontrack = (event) => {
            setRemoteStreams(prev => ({
                ...prev,
                [targetSocketId]: event.streams[0],
            }));
        };

        peers.current[targetSocketId] = { connection: pc, socketId: targetSocketId };
        return pc;
    }, [roomId]);

    useEffect(() => {
        if (!roomId || !userId) return;

        socket.connect();

        initLocalStream().then(stream => {
            if (!stream) return;

            socket.emit('join-room', roomId, userId);

            socket.on('user-joined', async ({ socketId }: { socketId: string }) => {
                console.log('User joined:', socketId);
            });



            socket.on('existing-users', (users: { socketId: string }[]) => {
                users.forEach(async (user) => {
                    const pc = createPeerConnection(user.socketId, stream);
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('offer', { roomId, to: user.socketId, offer });
                });
            });

            socket.on('offer', async ({ from, offer }) => {
                console.log('Received offer from:', from);
                const pc = createPeerConnection(from, stream);
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('answer', { roomId, to: from, answer });
            });

            socket.on('answer', async ({ from, answer }) => {
                console.log('Received answer from:', from);
                const pc = peers.current[from]?.connection;
                if (pc) {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                }
            });

            socket.on('ice-candidate', async ({ from, candidate }) => {
                const pc = peers.current[from]?.connection;
                if (pc) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                }
            });

            socket.on('user-left', (socketId: string) => {
                if (peers.current[socketId]) {
                    peers.current[socketId].connection.close();
                    delete peers.current[socketId];
                    setRemoteStreams(prev => {
                        const next = { ...prev };
                        delete next[socketId];
                        return next;
                    });
                }
            });
        });

        return () => {
            socket.off('user-joined');
            socket.off('existing-users');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
            socket.off('user-left');

            Object.values(peers.current).forEach(p => p.connection.close());
            peers.current = {};

            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }

            socket.disconnect();
        };
    }, [roomId, userId, createPeerConnection, initLocalStream]);

    return { localStream, remoteStreams };
}
