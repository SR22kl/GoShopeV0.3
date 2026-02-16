import { motion } from "framer-motion";
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { label: "Contact Us", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Shipping Info", href: "#" },
        { label: "Returns", href: "#" },
      ],
    },
    {
      title: "Policies",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Accessibility", href: "#" },
      ],
    },
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/search" },
        { label: "New Arrivals", href: "/search" },
        { label: "Best Sellers", href: "/search" },
        { label: "Sale", href: "/search" },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, label: "Facebook", href: "#" },
    { icon: FaXTwitter, label: "Twitter", href: "#" },
    { icon: FaInstagram, label: "Instagram", href: "#" },
    { icon: FaLinkedin, label: "LinkedIn", href: "#" },
  ];

  const FaUpi = ({ size = "1em", ...props }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: props.color || "inherit" }}
      {...props}
    >
      <path
        d="M7.74 15.35l.84-3.64H6.13l-.84 3.64H2.76l1.7-7.37h2.45l-.42 1.83h2.45l.42-1.83h2.45l-1.7 7.37H7.74zm6.15 0l.84-3.64h-2.45l-.84 3.64H9.01l1.7-7.37h2.45l-.42 1.83h2.45l.42-1.83h2.45l-1.7 7.37h-2.43zm6.15 0l1.24-5.38h-2.45l-.42 1.83h-1.54l-.42 1.83h1.54l-.42 1.72h-2.45l.42-1.72h-1.54l.84-3.66h5.45l-1.7 7.38h-2.43z"
        fill="currentColor"
      />
    </svg>
  );

  const paymentMethods = [
    { icon: FaUpi, label: "UPI" },
    { icon: FaCcVisa, label: "Visa" },
    { icon: FaCcMastercard, label: "Mastercard" },
    { icon: FaCcPaypal, label: "PayPal" },
    { icon: FaCcAmex, label: "American Express" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 text-gray-300">
      {" "}
      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500 opacity-20 blur-[120px] rounded-full"></div>
      <motion.div
        className="max-w-7xl mx-auto px-6 py-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {footerSections.map((section, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition duration-300"
            >
              <h4 className="text-white font-semibold text-lg mb-4">
                {section.title}
              </h4>

              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="relative inline-block hover:text-white transition duration-300 before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-[2px] before:bg-indigo-400 before:transition-all before:duration-300 hover:before:w-full"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-40 my-10"></div>

        {/* Contact + Social */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-10"
        >
          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold text-lg mb-4">Contact</h4>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MdPhone className="text-indigo-400 text-xl" />
                <span>+1 (800) 123-4567</span>
              </div>

              <div className="flex items-center gap-3">
                <MdEmail className="text-indigo-400 text-xl" />
                <span>support@goshope.com</span>
              </div>

              <div className="flex items-start gap-3">
                <MdLocationOn className="text-indigo-400 text-xl mt-1" />
                <span>New York, United States</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-white font-semibold text-lg mb-4">Follow Us</h4>

            <div className="flex gap-4 mb-6">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="w-11 h-11 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center transition duration-300 ease-in-out hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.8)] "
                  >
                    <Icon className="text-white" />
                  </motion.a>
                );
              })}
            </div>

            <h4 className="text-white font-semibold text-lg mb-3">We Accept</h4>

            <div className="flex gap-3 flex-wrap">
              {paymentMethods.map((method, idx) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="w-11 h-11 flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md rounded-lg transition duration-300 ease-in-out hover:bg-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.7)]"
                  >
                    <Icon className="text-white text-lg" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-40 my-10"></div>

        <motion.div
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              GoShope
            </h3>
            <p className="text-gray-400 text-sm">Premium Fashion & Lifestyle</p>
          </motion.div>

          <motion.p variants={itemVariants} className="text-gray-400 text-sm">
            © {currentYear} GoShope. All rights reserved.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Sitemap
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
