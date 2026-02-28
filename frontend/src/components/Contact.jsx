import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Send,
  Mail,
  User,
  MessageSquare,
  Loader as LoaderIcon,
} from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Contact = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.05 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Invalid email";
    if (!formData.message.trim()) errs.message = "Message is required";
    else if (formData.message.trim().length < 10)
      errs.message = "At least 10 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/contact`, formData);
      if (res.data.success) {
        toast.success("Message sent! I'll get back to you soon.", {
          duration: 5000,
          icon: "✉️",
        });
        setFormData({ name: "", email: "", message: "" });
        setSent(true);
      }
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Too many messages. Try again in 15 minutes.");
      } else {
        toast.error(
          error.response?.data?.error || "Failed to send. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3.5 rounded-xl bg-gray-50 border ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
        : "border-gray-200 focus:border-primary-500 focus:ring-primary-500/10"
    } focus:outline-none focus:ring-4 transition-all text-sm text-gray-900 placeholder-gray-400`;

  return (
    <section
      id="contact"
      className="py-20 lg:py-28 px-6 lg:px-8 bg-gray-50/50"
    >
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Get In Touch</span>
            </h2>
            <p className="mt-4 text-base text-gray-500 max-w-md mx-auto">
              Have a project in mind or just want to chat? I'd love to hear from
              you!
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center">
                  <span className="text-2xl">✉️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Thank you for reaching out. I'll respond shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider"
                  >
                    <User className="w-3.5 h-3.5" /> Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass("name")}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass("email")}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputClass("message")} resize-none`}
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-xs mt-1"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/15 hover:shadow-xl hover:shadow-primary-500/20"
                  whileHover={!loading ? { scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Direct email */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-400 mb-2">
              Or reach out directly at
            </p>
            <a
              href="mailto:your.email@example.com"
              className="text-base font-semibold text-primary-600 hover:underline"
            >
              your.email@example.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
