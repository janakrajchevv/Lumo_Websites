const EMAILJS_PUBLIC_KEY = "U8HeSrgrUWwG-73WS";
const EMAILJS_SERVICE_ID = "service_h0a3xee";
const EMAILJS_ADMIN_TEMPLATE_ID = "template_bkmosah";
const EMAILJS_CLIENT_TEMPLATE_ID = "template_uc0urkv";

emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
});

function toggleMenu() {
    document.getElementById("nav").classList.toggle("active");
}

function openContactModal() {
    document.getElementById("contactModal").classList.add("active");
}

function closeContactModal() {
    document.getElementById("contactModal").classList.remove("active");
}

function startCounters() {
    const counters = document.querySelectorAll(".stat-number");

    counters.forEach(function (counter) {
        if (counter.dataset.started === "true") return;

        const suffix = counter.getAttribute("data-suffix");

        if (suffix === "/7") return;

        counter.dataset.started = "true";

        const target = parseInt(counter.getAttribute("data-target"));
        const duration = 2000;
        const interval = 20;
        const increment = target / (duration / interval);

        let current = 0;

        const timer = setInterval(function () {
            current += increment;

            if (current >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + suffix;
            }
        }, interval);
    });
}

function checkCounters() {
    const statsSection = document.querySelector(".stats");

    if (!statsSection) return;

    const sectionTop = statsSection.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight - 100;

    if (sectionTop < triggerPoint) {
        startCounters();
        window.removeEventListener("scroll", checkCounters);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");

    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            status.textContent = "Се испраќа...";
            status.style.color = "#6b7280";

            const formData = {
                first_name: form.first_name.value,
                last_name: form.last_name.value,
                email: form.email.value,
                phone: form.phone.value,
                business_type: form.business_type.value,
                message: form.message.value
            };

            try {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_ADMIN_TEMPLATE_ID,
                    formData
                );

                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_CLIENT_TEMPLATE_ID,
                    formData
                );

                status.textContent = "Успешно го испративте вашето барање!";
                status.style.color = "#16a34a";
                form.reset();

                setTimeout(function () {
                    closeContactModal();
                    status.textContent = "";
                }, 2500);

            } catch (error) {
                console.log("EmailJS error:", error);
                status.textContent = "Настана грешка. Обидете се повторно.";
                status.style.color = "#dc2626";
            }
        });
    }

    checkCounters();
    window.addEventListener("scroll", checkCounters);
});