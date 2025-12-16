// components/landing/CTA.jsx
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
   <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of development teams already using Sprintly to ship faster and collaborate better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* UPDATED: Navigate to /register */}
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition shadow-lg text-lg font-semibold"
              >
                Join the Waitlist
              </button>
              <button className="px-8 py-4 bg-indigo-700 text-white rounded-xl hover:bg-indigo-800 transition border-2 border-indigo-400 text-lg font-semibold">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </section>
  );
}
