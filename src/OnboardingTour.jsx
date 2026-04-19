import { Joyride, STATUS } from 'react-joyride';
import React, { useState, useEffect } from 'react';

const OnboardingTour = () => {
  const [run, setRun] = useState(false);

  const [steps] = useState([
    // Use # id and . for ClassName
    {
      target: 'body',
      content: 'أهلاً بك! دعنا نأخذك في جولة سريعة لتعرف كيف تستخدم أدوات توليد الكود.',
      placement: 'center',
    },
    {
      target: '.node-selector',
      content: 'من هنا يمكنك إضافة عناصر جديدة إلى الرسم مثل Entity أو Controller.',
      title: 'لوحة إضافة العناصر'
    },
    {
      target: '#save-btn',
      content: 'هنا يمكنك حفظ الرسم البياني (Diagram) الخاص بك في ذاكرة المتصفح للعودة إليه لاحقاً.',
      title: 'حفظ العمل',
    },
    {
      target: '#History-btn',
      content: 'من هنا يمكنك الوصول إلى قائمة الأعمال التي قمت بحفظها سابقاً واستعادتها.',
      title: 'سجل العمليات',
    },
    {
      target: '#GenerateCode-btn',
      content: 'هذا هو المحرك الرئيسي! اضغط هنا لتوليد كود Java (Spring Boot) و React بناءً على رسمك.',
      title: 'توليد الكود',
    },
    {
      target: '#GenerateXml-btn',
      content: 'إذا كنت ترغب في رؤية البيانات بصيغة XML الخام أو تصديرها، استخدم هذا الزر.',
      title: 'عرض XML',
    },
    {
      target: '#info-btn',
      content: 'هل تحتاج لمساعدة أو تريد معرفة المزيد عن المشروع؟ اضغط هنا.',
      title: 'معلومات',
    },
    {
      target: '.application-container',
      content: 'هنا يمكنك تعديل اسم التطبيق الخاص بك',
      title: 'Application Name',
    },
  ]);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      const timer = setTimeout(() => setRun(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideEvent = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem('hasSeenTour', 'true');
      setRun(false);
    }
  };
  

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton={false}

      disableOverlayClose={true}   // يمنع الضغط خارج التور
      disableCloseOnEsc={true}     // يمنع زر ESC
      hideCloseButton={true}       // يخفي زر X
      spotlightClicks={false}      // ❌ يمنع التفاعل مع العناصر تحت التور

      onEvent={handleJoyrideEvent}
      locale={{
        back: 'السابق',
        close: 'إغلاق',
        last: 'إنهاء الجولة',
        next: 'التالي',
         skip: 'تخطي'
      }}
      options={{
        primaryColor: '#007bff',
        zIndex: 10000,
      }}
    />
  );
};

export default OnboardingTour;