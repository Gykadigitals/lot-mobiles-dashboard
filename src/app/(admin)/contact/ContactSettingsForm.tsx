"use client";

import React, { useState } from "react";
import { Save, MapPin, Mail, Phone, Clock, Type, Plus, X } from "lucide-react";

export default function ContactSettingsForm() {
  const [formData, setFormData] = useState({
    title: "Contact Us",
    subtitle: "We'd Love to Hear from You",
    description: "See the incredible difference our professional mobile and electronics services can make for you.",
    address: "LOT Tower, D.No.1-98/8/5/A, Plot No.3, Image Gardens lane Road, Madhapur, Hyderabad, Telangana-500081",
    phone: "040-4131 4131",
    email: "support@lotmobiles.com",
    hours: "Mon-Sun from 10am to 10pm",
    mapEmbedUrl: "https://www.openstreetmap.org/export/embed.html?bbox=78.3757,17.4375,78.3957,17.4575&layer=mapnik&marker=17.4475,78.3857"
  });

  const [serviceOptions, setServiceOptions] = useState([
    "Sales & Product Inquiry",
    "Technical Support",
    "Repair Service",
    "Other"
  ]);
  const [newOption, setNewOption] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const handleAddOption = () => {
    if (newOption.trim() && !serviceOptions.includes(newOption.trim())) {
      setServiceOptions([...serviceOptions, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (option: string) => {
    setServiceOptions(serviceOptions.filter((o) => o !== option));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
      <div className="p-5 md:p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Page Settings</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage the contact information displayed on the website.</p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-5 rounded-xl transition-colors duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-sm"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="p-5 md:p-6 space-y-8">

        {/* Header Section Content */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            Header Section
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-400" /> Page Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-400" /> Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-400" /> Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all text-sm resize-y min-h-[42px] overflow-y-auto"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-3 xl:col-span-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Physical Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all text-sm resize-y min-h-[42px] overflow-y-auto"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" /> Hours of Operation
              </label>
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Embed a map (URL)
              </label>
              <input
                type="text"
                name="mapEmbedUrl"
                value={formData.mapEmbedUrl}
                onChange={handleChange}
                placeholder="e.g. https://www.google.com/maps/embed?..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-gray-50 dark:bg-gray-800 dark:text-white transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Service Type Options */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
            Service Type Options (Dropdown)
          </h4>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex flex-wrap gap-3 mb-5">
              {serviceOptions.map((option) => (
                <div key={option} className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all group">
                  {option}
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(option)}
                    className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 dark:bg-gray-600 dark:hover:bg-red-900/30 rounded-md p-0.5"
                    aria-label="Remove option"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {serviceOptions.length === 0 && (
                <span className="text-sm text-gray-500 italic py-1.5">No options available. Add one below.</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
                placeholder="Enter new service option..."
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white dark:bg-gray-800 dark:text-white transition-all text-sm"
              />
              <button
                type="button"
                onClick={handleAddOption}
                disabled={!newOption.trim()}
                className="inline-flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-medium py-2 px-5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Option
              </button>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
