import { Joyride, STATUS } from 'react-joyride';
import React, { useState, useEffect } from 'react';

const mainRoute = [
    {
        target: 'body',
        content: 'أهلاً بك! دعنا نأخذك في جولة سريعة لتعرف كيف تستخدم أداة قوسبل لتوليد سبرينق بووت.',
        placement: 'center',
    },
    {
        target: '.node-selector',
        content: 'من هنا يمكنك إضافة عناصر جديدة إلى الرسم مثل Entity.',
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
        title: 'سجل المحفوظات',
    },
    {
        target: '#GenerateCode-btn',
        content: 'هذا هو المحرك الرئيسي! اضغط هنا لتوليد كود Java (Spring Boot) بناءً على رسمك.',
        title: 'توليد الكود',
    },
    {
        target: '#GenerateXml-btn',
        content: 'إذا كنت ترغب في رؤية البيانات بصيغة XML الخام أو تصديرها، استخدم هذا الزر.',
        title: 'توليد XML',
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
];

export default function Tours() {
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState(mainRoute);

    useEffect(() => {
        const hasSeenMainTour = localStorage.getItem('has-seen-main-tour');
        if (!hasSeenMainTour) {
            const timer = setTimeout(() => setRun(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleJoyrideEvent = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            localStorage.setItem('has-seen-main-tour', 'true');
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
            disableOverlayClose={true}
            disableCloseOnEsc={true}
            hideCloseButton={true}
            spotlightClicks={false}

            onEvent={handleJoyrideEvent}
            locale={{
                back: 'السابق',
                close: 'إغلاق',
                last: 'إنهاء الجولة',
                next: 'التالي',
                skip: 'تخطي'
            }}
            options={{ primaryColor: '#007bff', }}
        />
    );
};