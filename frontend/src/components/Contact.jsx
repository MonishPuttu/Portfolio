import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Send, Loader } from "lucide-react";
import { SectionDivider } from "./About";
import API_URL from "../config/api";

const LINKS = [
  {
    label: "Email",
    value: "monishputtu1780@gmail.com",
    href: "mailto:monishputtu1780@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/MonishPuttu",
    href: "https://github.com/MonishPuttu",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/monish-k",
    href: "https://linkedin.com/in/monish-k-543236251",
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Required";
    else if (form.message.trim().length < 10)
      e.message = "At least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/contact`, form);
      if (res.data.success) {
        toast.success("Message sent! I'll get back to you soon.", {
          duration: 5000,
        });
        setForm({ name: "", email: "", message: "" });
        setSent(true);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error("Too many messages. Try again in 15 minutes.");
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-gray-50 border text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all";
  const inputClass = (field) =>
    `${inputBase} ${
      errors[field]
        ? "border-red-300 focus:ring-red-200"
        : "border-gray-200 focus:border-primary-400 focus:ring-primary-100"
    }`;

  return (
    <div>
      <Toaster position="top-center" />
      <SectionDivider label="Contact" />

      <section className="px-6 lg:px-10 max-w-6xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-medium text-gray-900 mb-3 tracking-tight">
              Get in touch
            </h2>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
              Have a project in mind or just want to chat? I'd love to hear from
              you.
            </p>

            <div className="flex flex-col gap-4">
              {LINKS.map((link) => (
                <div key={link.label} className="flex items-baseline gap-3">
                  <span className="text-[11px] font-medium tracking-[0.1em] text-gray-400 uppercase w-16 flex-shrink-0">
                    {link.label}
                  </span>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {link.value}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center text-xl">
                  ✉️
                </div>
                <h3 className="text-[15px] font-medium text-gray-900 mb-2">
                  Message sent!
                </h3>
                <p className="text-[13px] text-gray-400 mb-5">
                  Thank you for reaching out. I'll respond shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-[13px] text-primary-600 hover:underline"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputClass("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <textarea
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Reason for contact"
                    className={`${inputClass("message")} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-[11px] mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white text-[13px] font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
                >
                  {loading ? (
                    <>
                      <Loader size={14} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Send message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
