import { mdiChartTimelineVariant, mdiPlus, mdiDownload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement } from 'react'
import CardBox from '@/components/Cardbox/CardBox'
import LayoutAuthenticated from '@/layouts/Authenticated'
import SectionMain from '@/components/Section/SectionMain'
import SectionTitleLineWithButton from '@/components/Section/SectionTitleLineWithButton'
import { getPageTitle } from '@/config'
import BaseButton from '@/components/Base/BaseButton'
import axios from 'axios'
import TableAgencyTypes from "@/components/Agency_types/TableAgencyTypes";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { withAuth } from "@/components/auth/withAuth";
import { Permission } from "@/constants/permissions";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

const AgencyTypesPage = () => {
    // Download CSV of agency types
    const downloadAgencyTypesCSV = async () => {
        try {
            const response = await axios({
                url: '/agencyType?filetype=csv',
                method: 'GET',
                responseType: 'blob',
            });

            const type = response.headers['content-type'];
            const blob = new Blob([response.data], { type: type });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'agency_types_export.csv';
            link.click();

            // Clean up
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading CSV:', error);
        }
    };

    return (
        <>
            <Head>
                <title>{getPageTitle('Agency Types')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiChartTimelineVariant}
                    title='Agency Types Management'
                    main
                >
                    <BreadcrumbsBar items={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Agency Types', href: '/agency_types/agency_types-list' },
                    ]} />
                </SectionTitleLineWithButton>

                {/* Action Buttons */}
                <CardBox className='mb-6 flex flex-wrap gap-4'>
                    <PermissionGuard permission={Permission.CREATE_AGENCY_TYPE}>
                        <BaseButton
                            className='mr-2'
                            href='/agency_types/agency_types-new'
                            color='success'
                            label='Add New Agency Type'
                            icon={mdiPlus}
                        />
                    </PermissionGuard>
                    <BaseButton
                        color='warning'
                        label='Export CSV'
                        icon={mdiDownload}
                        onClick={downloadAgencyTypesCSV}
                    />
                </CardBox>

                {/* Agency Types Table */}
                <CardBox className='mb-6' hasTable>
                    <TableAgencyTypes />
                </CardBox>
            </SectionMain>
        </>
    )
}

AgencyTypesPage.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default withAuth(AgencyTypesPage, {
    permissions: [Permission.VIEW_AGENCY_TYPES]
});
