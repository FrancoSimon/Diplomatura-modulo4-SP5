// ContactForm.jsx
import React, { useState } from "react";
import Button from "./Button";

const ContactoForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validación de nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    // Validación de asunto
    if (!formData.subject.trim()) {
      newErrors.subject = "El asunto es obligatorio";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "El asunto debe tener al menos 5 caracteres";
    }

    // Validación de mensaje
    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Formulario enviado:", formData);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setErrors({});
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-800 to-orange-300 flex items-center justify-center p-4 pt-22">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-br from-green-600 to-green-400 text-white p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-check2-circle text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Mensaje Enviado!</h1>
            <p className="text-green-100 text-sm">
              Hemos recibido tu mensaje correctamente
            </p>
          </div>
          
          <div className="p-6 text-center">
            <p className="text-gray-600 mb-6">
              Te contactaremos en un plazo máximo de 24 horas hábiles.
            </p>
            <Button 
              onClick={resetForm}
              variant="primary"
              className="w-full"
            >
              <i className="bi bi-send-fill mr-2"></i>
              Enviar Otro Mensaje
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-800 to-orange-300 flex items-center justify-center p-4 sm:p-6 pt-20 sm:pt-22">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-800 to-orange-300 text-white p-6 sm:p-8 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-envelope-fill text-xl"></i>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Contáctanos</h1>
          <p className="text-amber-100 text-sm sm:text-base">
            Estamos aquí para responder cualquier pregunta que tengas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <i className="bi bi-exclamation-circle mr-1"></i>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <i className="bi bi-exclamation-circle mr-1"></i>
                {errors.email}
              </p>
            )}
          </div>

          {/* Asunto */}
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Asunto *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Asunto del mensaje"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <i className="bi bi-exclamation-circle mr-1"></i>
                {errors.subject}
              </p>
            )}
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Mensaje *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Escribe tu mensaje aquí..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-vertical outline-none ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <i className="bi bi-exclamation-circle mr-1"></i>
                {errors.message}
              </p>
            )}
          </div>

          {/* Botón de envío */}
          <div className="flex items-center justify-center pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              variant="primary"
              size="large"
              className="w-full min-h-[50px]"
            >
              {isSubmitting ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
                  Enviando...
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill mr-2"></i>
                  Enviar Mensaje
                </>
              )}
            </Button>
          </div>

          {/* Footer del form */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-xs sm:text-sm">
              <i className="bi bi-clock mr-1"></i>
              Te responderemos en un plazo máximo de 24 horas
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Los campos marcados con * son obligatorios
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactoForm;
