import { Joyride, STATUS } from 'react-joyride';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Tours() {
    const { t } = useTranslation();
    const mainRoute = [
        {
            target: 'body',
            content: t('tours_main_tour_step_0'),
            placement: 'center',
        },
        {
            target: '.node-selector',
            title: t('tours_main_tour_step_1_title'),
            content: t('tours_main_tour_step_1'),
        },
        {
            target: '#save-btn',
            title: t('tours_main_tour_step_2_title'),
            content: t('tours_main_tour_step_2'),
        },
        {
            target: '#History-btn',
            title: t('tours_main_tour_step_3_title'),
            content: t('tours_main_tour_step_3'),
        },
        {
            target: '#GenerateCode-btn',
            title: t('tours_main_tour_step_4_title'),
            content: t('tours_main_tour_step_4'),
        },
        {
            target: '#GenerateXml-btn',
            title: t('tours_main_tour_step_5_title'),
            content: t('tours_main_tour_step_5'),
        },
        {
            target: '#info-btn',
            title: t('tours_main_tour_step_6_title'),
            content: t('tours_main_tour_step_6'),
        },
        {
            target: '.application-container',
            title: t('tours_main_tour_step_7_title'),
            content: t('tours_main_tour_step_7'),
        },
    ];

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
                back: t('tours_back'),
                close: t('close'),
                last: t('tours_last'),
                next: t('tours_next'),
                skip: t('tours_skip')
            }}
            options={{ primaryColor: '#007bff', }}
        />
    );
};