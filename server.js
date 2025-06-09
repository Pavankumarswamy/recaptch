// script.js

function onSubmit(token) {
  // Send token to your Flutter backend
  fetch("https://your-backend-url.com/verify-recaptcha", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: token
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.score >= 0.5) {
      console.log("✅ reCAPTCHA passed with score", data.score);
      // You can notify Flutter app from here using postMessage if using WebView
    } else {
      console.warn("⚠️ reCAPTCHA failed or suspicious (score:", data.score, ")");
    }
  })
  .catch(err => {
    console.error("🚫 Error verifying reCAPTCHA:", err);
  });
}

function runRecaptcha() {
  grecaptcha.ready(function () {
    grecaptcha.execute('6Lf-hVorAAAAALJmAB_kKL2acu_J9jFYdDKSumu5', { action: 'submit' })
      .then(function (token) {
        console.log("🔑 Token received:", token);
        onSubmit(token);
      });
  });
}
