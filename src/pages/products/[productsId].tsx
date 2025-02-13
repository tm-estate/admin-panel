import {
    mdiAccount,
    mdiChartTimelineVariant,
    mdiMail, mdiTrashCan,
    mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-datepicker/dist/react-datepicker.css';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';

import { update, fetch } from '../../stores/products/productsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import {SelectField} from "../../components/SelectField";
import FormImagePicker from '../../components/FormImagePicker'

const EditProduct = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const initVals = {
        ['name']: '',

        ['description']: '',

        ['address']: '',

        ['price']: 0,

        ['dealType']: '',

        ['propertyType']: '',
        ['region']: '',
        ['city']: '',
        ['cityArea']: '',
    };
    const [initialValues, setInitialValues] = useState(initVals);

    const { products } = useAppSelector((state) => state.products);

    const { productsId } = router.query;

    useEffect(() => {
        dispatch(fetch({ id: productsId }));
    }, [productsId]);

    useEffect(() => {
        if (typeof products === 'object') {
            setInitialValues(products);
        }
    }, [products]);

    useEffect(() => {
        if (typeof products === 'object') {
            const newInitialVal = { ...initVals };

            Object.keys(initVals).forEach(
                (el) => (newInitialVal[el] = products[el]),
            );

            setInitialValues(newInitialVal);
        }
    }, [products]);

    const handleSubmit = async (data) => {
        await dispatch(update({ id: productsId, data }));
        await router.push('/products/products-list');
    };

    return (
        <>
            <Head>
                <title>{getPageTitle('Edit product')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton
                    icon={mdiChartTimelineVariant}
                    title='Edit products'
                    main
                >
                    Breadcrumbs
                </SectionTitleLineWithButton>
                <CardBox>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        <Form>
                            <FormField label="Images" labelFor="images">
                                <Field
                                    name="images"
                                    id="images"
                                    component={FormImagePicker}
                                    // options={initialValues.region}
                                    itemRef={'images'}
                                    showField={'image'}
                                ></Field>
                            </FormField>
                            {/*<FormImagePicker*/}
                            {/*    label={'test label'}*/}
                            {/*    icon={mdiTrashCan}*/}
                            {/*    color={'white'}*/}
                            {/*    path={'src/images/'}*/}
                            {/*    field={undefined}*/}
                            {/*    form={undefined}*/}
                            {/*    schema={undefined}*/}
                            {/*/>*/}

                            <FormField label='Name'>
                                <Field name='name' placeholder='Your Name of product' />
                            </FormField>

                            <FormField label='description'>
                                <Field name='description' placeholder='Your description' />
                            </FormField>

                            <FormField label='address'>
                                <Field name='address' placeholder='address' />
                            </FormField>

                            <FormField label="Deal Type" labelFor="dealType">
                                <Field
                                    name="dealType"
                                    id="dealType"
                                    component={SelectField}
                                    options={initialValues.dealType}
                                    itemRef={'dealTypes'}
                                    showField={'titleRu'}
                                ></Field>
                            </FormField>

                            <FormField label="Property Type" labelFor="propertyType">
                                <Field
                                    name="propertyType"
                                    id="propertyType"
                                    component={SelectField}
                                    options={initialValues.propertyType}
                                    itemRef={'propertyTypes'}
                                    showField={'titleRu'}
                                ></Field>
                            </FormField>

                            <FormField label="Region" labelFor="region">
                                <Field
                                    name="region"
                                    id="region"
                                    component={SelectField}
                                    options={initialValues.region}
                                    itemRef={'regions'}
                                    showField={'titleRu'}
                                ></Field>
                            </FormField>

                            <FormField label="City" labelFor="city">
                                <Field
                                    name="city"
                                    id="city"
                                    component={SelectField}
                                    options={initialValues.city}
                                    itemRef={'cities'}
                                    showField={'titleRu'}
                                ></Field>
                            </FormField>

                            <FormField label="City area" labelFor="cityArea">
                                <Field
                                    name="cityArea"
                                    id="cityArea"
                                    component={SelectField}
                                    options={initialValues.cityArea}
                                    itemRef={'cityAreas'}
                                    showField={'titleRu'}
                                ></Field>
                            </FormField>

                            <BaseDivider />

                            <BaseButtons>
                                <BaseButton type='submit' color='info' label='Submit' />
                                <BaseButton type='reset' color='info' outline label='Reset' />
                                <BaseButton
                                    type='reset'
                                    color='danger'
                                    outline
                                    label='Cancel'
                                    onClick={() => router.push('/products/products-list')}
                                />
                            </BaseButtons>
                        </Form>
                    </Formik>
                </CardBox>
            </SectionMain>
        </>
    );
};

EditProduct.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditProduct;
