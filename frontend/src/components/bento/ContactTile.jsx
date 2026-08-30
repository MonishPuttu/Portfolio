import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Send, Loader2, ArrowRight } from "lucide-react";
import Tile, { TileLabel } from "./Tile";
import { PROFILE } from "../../config/profile";
import API_URL from "../../config/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactTile = ({ delay = 0, tileRef }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.email.trim()) next.email = "Required";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email";
    if (!form.message.trim()) next.message = "Required";
    else if (form.message.trim().length < 10)
      next.message = "At least 10 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    try {
      const { data } = await axios.post(`${API_URL}/contact`, form);
      if (data.success) {
        toast.success("Message sent — I'll get back to you within a day.", {
          duration: 5000,
        });
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error("Too many messages. Try again in 15 minutes.");
      } else {
        toast.error("Couldn't send that. Try again, or email me directly.");
      }
    } finally {
      setSending(false);
    }
  };

  const field = (name) =>
    `w-full rounded-xl border bg-white/10 px-3.5 py-2.5 text-[13px] text-white placeholder-white/45 transition focus:outline-none focus:ring-2 ${
      errors[name]
        ? "border-red-300/70 focus:ring-red-300/40"
        : "border-white/20 focus:border-white/50 focus:ring-white/25"
    }`;

  return (
    <Tile
      span="col-span-12"
      tileRef={tileRef}
      delay={delay}
      className="border-primary-600 bg-primary-600 text-white lg:!flex-row lg:items-start lg:gap-8"
    >
      <div className="lg:flex-1">
        <TileLabel className="text-white/60">Say hello</TileLabel>
        <h3 className="mt-3 font-display text-[clamp(22px,2.7vw,32px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-balance">
          Hiring, collaborating, or just curious?
        </h3>

        <a
          href={`mailto:${PROFILE.email}`}
          className="mt-5 flex w-full items-center justify-between gap-3 rounded-2xl bg-white/15 px-[17px] py-3.5 text-[13px] font-medium transition-colors hover:bg-white/25 lg:max-w-sm"
        >
          <span>{PROFILE.email}</span>
          <ArrowRight size={15} />
        </a>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/30 px-3.5 py-1.5 text-[11.5px] transition-colors hover:bg-white/15"
          >
            GitHub
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/30 px-3.5 py-1.5 text-[11.5px] transition-colors hover:bg-white/15"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 flex flex-col gap-2.5 lg:mt-0 lg:w-[380px] lg:flex-none"
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              aria-label="Your name"
              aria-invalid={Boolean(errors.name)}
              className={field("name")}
            />
            {errors.name && (
              <p className="mt-1 text-[11px] text-red-200">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              aria-label="Your email"
              aria-invalid={Boolean(errors.email)}
              className={field("email")}
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-200">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <textarea
            name="message"
            rows={3}
            value={form.message}
            onChange={handleChange}
            placeholder="Reason for contact"
            aria-label="Your message"
            aria-invalid={Boolean(errors.message)}
            className={`${field("message")} resize-none`}
          />
          {errors.message && (
            <p className="mt-1 text-[11px] text-red-200">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={sending}
          className="flex items-center justify-center gap-2 rounded-xl bg-spark px-5 py-3 text-[13px] font-bold text-ink transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send size={15} />
              Send message
            </>
          )}
        </button>
      </form>
    </Tile>
  );
};

export default ContactTile;
