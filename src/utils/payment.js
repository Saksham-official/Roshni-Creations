const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
};

export const initiatePayment = async ({ amount, description, items, onSuccess, onEmailSuccess }) => {
    const res = await loadRazorpayScript();
    if (!res) {
        alert("Payment gateway failed to load.");
        return;
    }

    const options = {
        key: "rzp_test_Sc7NXcTnAZCMkn",
        amount: amount * 100,
        currency: "INR",
        name: "Roshni Creations",
        description: description || "Order Purchase",
        image: "https://i.imgur.com/3g7nmJC.png",
        handler: async function (response) {
            // Success handler logic
            const paymentId = response.razorpay_payment_id;
            
            // 1. Send Confirmation Email
            try {
                await fetch('/api/send-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'judge@hackathon.com',
                        paymentId: paymentId,
                        orderDetails: {
                            items: items || [],
                            name: description.replace('Purchase ', ''),
                            price: amount
                        }
                    })
                });
                if (onEmailSuccess) onEmailSuccess();
            } catch (err) {
                console.error('Email confirmation failed', err);
            }

            // 2. Alert & Callback
            alert(`Order Placed Successfully! ID: ${paymentId}`);
            if (onSuccess) onSuccess(paymentId);
        },
        prefill: {
            name: "Hackathon Judge",
            email: "judge@hackathon.com",
            contact: "9999999999",
        },
        theme: { color: "#D1B88A" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
};
