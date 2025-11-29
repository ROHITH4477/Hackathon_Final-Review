import React from 'react';

const RazorpayHandler = ({ onPaymentSuccess }) => {

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpayScript();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        const options = {
            key: 'rzp_test_Rlgtu6wuzDDfu8', // YOUR TEST KEY ID
            amount: 49900, // Amount is in currency subunits. Default currency is INR. Hence, 49900 refers to 49900 paise
            currency: 'INR',
            name: 'Campus Wellness Hub',
            description: 'Premium Membership Transaction',
            image: 'https://cdn-icons-png.flaticon.com/512/3063/3063822.png', // Optional Logo
            handler: function (response) {
                // In a real app, you would send response.razorpay_payment_id to your backend for verification
                console.log("Payment Successful!", response);
                // alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                if (onPaymentSuccess) {
                    onPaymentSuccess(response.razorpay_payment_id);
                }
            },
            prefill: {
                name: 'Student Name', // You can prefill these if you have user data
                email: 'student@campus.edu',
                contact: '9999999999'
            },
            notes: {
                address: 'Campus Wellness Hub Corporate Office'
            },
            theme: {
                color: '#0d9488' // Teal color to match app theme
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2"
        >
            <span>💎</span>
            Upgrade to Premium (₹499)
        </button>
    );
};

export default RazorpayHandler;
