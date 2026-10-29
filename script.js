"use strict";

/* ========================================
   HOME TECH — CONFIGURATION
======================================== */

const HOME_TECH_CONFIG = {
  whatsappNumbers: [
    "201260072792",
    "201212100766"
  ],

  // رقم الواتساب الذي يستقبل رسائل نموذج التواصل.
  // الرقم الأول هو الافتراضي، ويمكن تغييره للثاني.
  formWhatsappNumber: "201260072792"
};

/* ========================================
   INITIALIZATION
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initFooterYear();
  initServiceSelection();
  initContactForm();
});

/* ========================================
   MOBILE NAVIGATION
======================================== */

function initMobileNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) {
    return;
  }

  function setMenuState(isOpen) {
    mainNav.classList.toggle("is-open", isOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "إغلاق القائمة" : "فتح القائمة"
    );

    document.body.classList.toggle("menu-open", isOpen);
  }

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    setMenuState(!isOpen);
  });

  // إغلاق القائمة بعد اختيار أي رابط.
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  // إغلاق القائمة باستخدام زر Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        setMenuState(false);
        menuToggle.focus();
      }
    }
  });

  // إغلاق القائمة عند الضغط خارجها.
  document.addEventListener("click", (event) => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (
      isOpen &&
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenuState(false);
    }
  });

  // إعادة ضبط القائمة عند الانتقال إلى شاشة الكمبيوتر.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      setMenuState(false);
    }
  });
}

/* ========================================
   FOOTER YEAR
======================================== */

function initFooterYear() {
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* ========================================
   SERVICE SELECTION
======================================== */

function initServiceSelection() {
  const serviceSelect = document.getElementById("service");

  if (!serviceSelect) {
    return;
  }

  const serviceLinks = document.querySelectorAll("[data-service]");

  serviceLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const serviceName = link.dataset.service;

      const matchingOption = Array.from(
        serviceSelect.options
      ).find((option) => option.value === serviceName);

      if (matchingOption) {
        serviceSelect.value = matchingOption.value;

        // إطلاق حدث change لإتاحة التعامل مع الاختيار مستقبلًا.
        serviceSelect.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      }
    });
  });
}

/* ========================================
   CONTACT FORM
======================================== */

function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form || !status) {
    return;
  }

  /*
    نستخدم التحقق المخصص حتى تظهر رسائل الخطأ
    بجوار الحقول بدل الاعتماد على رسائل المتصفح فقط.
  */
  form.noValidate = true;

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    service: document.getElementById("service"),
    message: document.getElementById("message")
  };

  const errorElements = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    service: document.getElementById("serviceError"),
    message: document.getElementById("messageError")
  };

  // التأكد من وجود كل العناصر المطلوبة.
  const fieldsExist = Object.values(fields).every(Boolean);
  const errorsExist = Object.values(errorElements).every(Boolean);

  if (!fieldsExist || !errorsExist) {
    console.error(
      "Home Tech: بعض عناصر نموذج التواصل غير موجودة في HTML."
    );
    return;
  }

  function showFieldError(fieldName, message) {
    const field = fields[fieldName];
    const errorElement = errorElements[fieldName];

    errorElement.textContent = message;

    field.setAttribute(
      "aria-invalid",
      String(Boolean(message))
    );

    if (message) {
      field.setAttribute(
        "aria-describedby",
        errorElement.id
      );
    } else {
      field.removeAttribute("aria-describedby");
    }
  }

  function clearErrors() {
    Object.keys(fields).forEach((fieldName) => {
      showFieldError(fieldName, "");
    });

    status.textContent = "";
    status.classList.remove("error");
  }

  function validateForm() {
    clearErrors();

    let isValid = true;

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const service = fields.service.value;
    const message = fields.message.value.trim();

    // التحقق من الاسم.
    if (name.length < 2) {
      showFieldError(
        "name",
        "اكتب اسمًا مكوّنًا من حرفين على الأقل."
      );

      isValid = false;
    }

    // التحقق من البريد الإلكتروني.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailPattern.test(email) ||
      email.length > 150
    ) {
      showFieldError(
        "email",
        "اكتب بريدًا إلكترونيًا صحيحًا."
      );

      isValid = false;
    }

    // التحقق من الخدمة.
    const validServices = Array.from(
      fields.service.options
    ).map((option) => option.value);

    if (
      !service ||
      !validServices.includes(service)
    ) {
      showFieldError(
        "service",
        "اختار الخدمة اللي محتاجها."
      );

      isValid = false;
    }

    // التحقق من تفاصيل المشروع.
    if (message.length < 10) {
      showFieldError(
        "message",
        "اكتب تفاصيل أكثر عن مشروعك، بحد أدنى 10 أحرف."
      );

      isValid = false;
    }

    return isValid;
  }

  // إزالة الخطأ بعد تعديل الحقل.
  Object.keys(fields).forEach((fieldName) => {
    const field = fields[fieldName];

    field.addEventListener("input", () => {
      showFieldError(fieldName, "");

      if (status.classList.contains("error")) {
        status.textContent = "";
        status.classList.remove("error");
      }
    });

    field.addEventListener("change", () => {
      showFieldError(fieldName, "");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      status.textContent =
        "راجع البيانات المطلوبة قبل المتابعة.";

      status.classList.add("error");

      const firstInvalidField = form.querySelector(
        '[aria-invalid="true"]'
      );

      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return;
    }

    const companyField = document.getElementById("company");

    const lead = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      company: companyField
        ? companyField.value.trim()
        : "",
      service: fields.service.value,
      message: fields.message.value.trim()
    };

    // إنشاء الرسالة التي ستظهر في واتساب.
    const whatsappMessage = [
      "مرحبًا Home Tech، أريد الاستفسار عن خدماتكم.",
      "",
      `الاسم: ${lead.name}`,
      `البريد الإلكتروني: ${lead.email}`,
      `الشركة أو الموقع: ${lead.company || "لم يتم تحديده"}`,
      `الخدمة المطلوبة: ${lead.service}`,
      `تفاصيل المشروع: ${lead.message}`
    ].join("\n");

    const whatsappNumber =
      HOME_TECH_CONFIG.formWhatsappNumber;

    // التحقق من إعداد رقم واتساب.
    if (
      !/^\d{10,15}$/.test(whatsappNumber)
    ) {
      status.textContent =
        "رقم واتساب غير مضبوط. راجع إعدادات الشركة في script.js.";

      status.classList.add("error");
      return;
    }

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=` +
      encodeURIComponent(whatsappMessage);

    /*
      لا نعرض رسالة نجاح كاذبة.
      البيانات لن تُحفظ في قاعدة بيانات،
      والرسالة لن تُرسل إلا إذا أرسلها العميل من واتساب.
    */
    status.textContent =
      "بياناتك صحيحة. افتح واتساب وراجع الرسالة ثم اضغط إرسال.";

    status.classList.remove("error");

    const whatsappWindow = window.open(
      whatsappUrl,
      "_blank"
    );

    // بديل إذا منع المتصفح فتح نافذة جديدة.
    if (!whatsappWindow) {
      window.location.href = whatsappUrl;
    }
  });
}