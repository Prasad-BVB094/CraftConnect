import React, { useState } from 'react';
import apiService from '../services/api';

function CustomerSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Order Issue',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      // Format data for backend
      const submitData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || formData.category,
        message: formData.message,
        category: formData.category.toLowerCase().replace(/[^a-z]/g, '') || 'general'
      };
      await apiService.submitSupportRequest(submitData);
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFormData({ name: '', email: '', category: 'Order Issue', subject: '', message: '' });
      }, 2000);
    } catch (err) {
      alert('Failed to submit. Please try again.');
    }
    setIsSubmitting(false);
  };

  // SVG Icons - Chat Bubble for better visibility
  const SupportIcon = React.createElement('svg', { 
    width: '28', 
    height: '28', 
    viewBox: '0 0 24 24', 
    fill: 'none', 
    stroke: '#ffffff', 
    strokeWidth: '2', 
    strokeLinecap: 'round', 
    strokeLinejoin: 'round' 
  },
    React.createElement('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
  );

  const CloseIcon = React.createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
    React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
  );

  return React.createElement(
    React.Fragment,
    null,

    /* Floating Button */
    React.createElement(
      'button',
      {
        onClick: () => setIsOpen(true),
        style: {
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), #8B6F47)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(62,44,32,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(62,44,32,0.4)';
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(62,44,32,0.3)';
        },
        title: 'Customer Support'
      },
      SupportIcon
    ),

    /* Modal Overlay */
    isOpen && React.createElement(
      'div',
      {
        onClick: () => setIsOpen(false),
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },

      /* Modal Content */
      React.createElement(
        'div',
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            width: '420px',
            maxHeight: '90vh',
            background: 'linear-gradient(180deg, #fff, rgba(248,244,239,0.98))',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            position: 'relative',
            overflowY: 'auto'
          }
        },

        /* Close Button */
        React.createElement(
          'button',
          {
            onClick: () => setIsOpen(false),
            style: {
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)'
            }
          },
          CloseIcon
        ),

        /* Header */
        React.createElement('h3', {
          style: {
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            color: 'var(--accent)',
            marginBottom: '8px'
          }
        }, 'How can we help?'),
        React.createElement('p', {
          style: { color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }
        }, "We're here to assist you with any questions or concerns."),

        /* Success Message */
        submitted ? React.createElement(
          'div',
          {
            style: {
              textAlign: 'center',
              padding: '40px 20px'
            }
          },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '16px' } }, '✓'),
          React.createElement('h4', { style: { color: 'var(--accent)', marginBottom: '8px' } }, 'Message Sent!'),
          React.createElement('p', { style: { color: 'var(--muted)' } }, "We'll get back to you soon.")
        ) :

        /* Form */
        React.createElement(
          'div',
          null,

          /* Name */
          React.createElement('input', {
            type: 'text',
            placeholder: 'Your Name *',
            value: formData.name,
            onChange: (e) => handleChange('name', e.target.value),
            style: inputStyle
          }),

          /* Email */
          React.createElement('input', {
            type: 'email',
            placeholder: 'Email Address *',
            value: formData.email,
            onChange: (e) => handleChange('email', e.target.value),
            style: inputStyle
          }),

          /* Category */
          React.createElement('select', {
            value: formData.category,
            onChange: (e) => handleChange('category', e.target.value),
            style: { ...inputStyle, cursor: 'pointer' }
          },
            React.createElement('option', null, 'Order Issue'),
            React.createElement('option', null, 'Product Query'),
            React.createElement('option', null, 'Returns & Refunds'),
            React.createElement('option', null, 'Shipping'),
            React.createElement('option', null, 'Other')
          ),

          /* Subject */
          React.createElement('input', {
            type: 'text',
            placeholder: 'Subject',
            value: formData.subject,
            onChange: (e) => handleChange('subject', e.target.value),
            style: inputStyle
          }),

          /* Message */
          React.createElement('textarea', {
            placeholder: 'Your Message *',
            value: formData.message,
            onChange: (e) => handleChange('message', e.target.value),
            rows: 4,
            style: { ...inputStyle, resize: 'vertical' }
          }),

          /* Submit */
          React.createElement(
            'button',
            {
              onClick: handleSubmit,
              disabled: isSubmitting,
              style: {
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, var(--accent), #8B6F47)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'opacity 0.3s ease'
              }
            },
            isSubmitting ? 'Sending...' : 'Send Message'
          )
        )
      )
    )
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px',
  borderRadius: '10px',
  border: '1px solid rgba(166,138,100,0.2)',
  marginBottom: '14px',
  fontSize: '15px',
  fontFamily: "'Neue Montreal', 'Poppins', sans-serif",
  outline: 'none',
  background: '#fff'
};

export default CustomerSupportWidget;
