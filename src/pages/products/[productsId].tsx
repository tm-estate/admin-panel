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

import { update, getProduct } from '../../stores/thunks/products';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { SelectField } from "../../components/UI/SelectField";
import FormImagePicker from '../../components/FormImagePicker'
import {ILocalizedTitles, IProduct, IProductParameter} from "../../interfaces";
import productParametersApi from "../../api/productParameters";
import { AsyncSelectField } from "../../components/UI/AsyncSelectField";
import FormCheckRadio from "../../components/FormCheckRadio";
import { SwitchField } from "../../components/SwitchField";
import { SelectFieldMany } from "../../components/UI/SelectFieldMany";

const EditProduct = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const initValues: IProduct = {
        images: [],
        name: '',
        description: '',
        address: '',
        price: 0,
        dealType: null,
        propertyType: null,
        region: null,
        city: null,
        cityArea: null,
        productCharacters: {
            bathroom: '',
            balcony: '',
            bedsQuantity: '',
            ceilingHeight: '',
            constructionYear: '',
            floor: '',
            homeInfrastructure: [],
            inBathroom: [],
            inKitchen: [],
            levelsNumber: '',
            lifeArrangement: [],
            propertyCondition: '',
            rentalType: '',
            repair: '',
            roomsQuantity: '',
            storeysNumber: '',
            studio: false,
            totalArea_sq_m: 0,
            wallMaterial: '',
        },
        coordinate: {
            latitude: null,
            longitude: null,
        },
    };
    const [initialValues, setInitialValues] = useState(initValues);
    const { product } = useAppSelector((state) => state.products);
    const [isLoading, setIsLoading] = useState(true);
    const [productCharacters, setProductCharacters] = useState<IProductParameter[]>([]);
    const { productsId } = router.query;

    useEffect(() => {
        if(productsId) {
            dispatch(getProduct(productsId));
            getProductCharacters()
        }
    }, [productsId]);

    useEffect(() => {
        if (typeof product === 'object') {
            setInitialValues(product);
            setIsLoading(false)
        }
    }, [product]);

    const getProductCharacters = async () =>  {
        try {
            const { data } = await productParametersApi.getProductParametersAutocomplete();
            setProductCharacters(data)
        } catch (e) {
            console.error(e)
        }
    }

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
                    { !isLoading && initialValues &&
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
                                        options={initialValues.images}
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

                                <FormField label='Name' labelFor='name'>
                                    <Field name='name' placeholder='Your Name of product'/>
                                </FormField>

                                <FormField label='Description' labelFor='description'>
                                    <Field name='description' placeholder='Your description'/>
                                </FormField>

                                <FormField label='Address' labelFor='address'>
                                    <Field name='address' placeholder='Your address'/>
                                </FormField>

                                <FormField label="Deal Type" labelFor="dealType">
                                    <Field
                                        name="dealType"
                                        id="dealType"
                                        component={AsyncSelectField}
                                        options={initialValues.dealType}
                                        itemRef={'dealTypes'}
                                        showField={'titleRu'}
                                    ></Field>
                                </FormField>

                                <FormField label="Property Type" labelFor="propertyType">
                                    <Field
                                        name="propertyType"
                                        id="propertyType"
                                        component={AsyncSelectField}
                                        options={initialValues.propertyType}
                                        itemRef={'propertyTypes'}
                                        showField={'titleRu'}
                                    ></Field>
                                </FormField>

                                <FormField label="Region" labelFor="region">
                                    <Field
                                        name="region"
                                        id="region"
                                        component={AsyncSelectField}
                                        options={initialValues.region}
                                        itemRef={'regions'}
                                        showField={'titleRu'}
                                    ></Field>
                                </FormField>

                                <FormField label="City" labelFor="city">
                                    <Field
                                        name="city"
                                        id="city"
                                        component={AsyncSelectField}
                                        options={initialValues.city}
                                        itemRef={'cities'}
                                        showField={'titleRu'}
                                    ></Field>
                                </FormField>

                                <FormField label="City area" labelFor="cityArea">
                                    <Field
                                        name="cityArea"
                                        id="cityArea"
                                        component={AsyncSelectField}
                                        options={initialValues.cityArea}
                                        itemRef={'cityAreas'}
                                        showField={'titleRu'}
                                    ></Field>
                                </FormField>

                                <h1 className='text-xl font-bold mb-3'>Product Characters</h1>

                                { productCharacters.map(item => (
                                    item.selectType === "Boolean" ?
                                        <FormField label={item.titleEn} labelFor={`productCharacters.${item.key}`} key={item.key}>
                                            <Field
                                                name={`productCharacters.${item.key}`}
                                                id={item.key}
                                                component={SwitchField}
                                            />
                                        </FormField>
                                        : item.selectType === "Number" ?
                                        <FormField label={item.titleEn} labelFor={`productCharacters.${item.key}`} key={item.key}>
                                            <Field name={`productCharacters.${item.key}`} placeholder='Total area sq/m'/>
                                        </FormField>
                                        : item.selectType === "Multi" ?
                                        <FormField label={item.titleEn} labelFor={`productCharacters.${item.key}`} key={item.key}>
                                            <Field
                                                name={`productCharacters.${item.key}`}
                                                id={item.key}
                                                component={SelectFieldMany}
                                                initial={initialValues.productCharacters[item.key]}
                                                options={item.items}
                                                showField={'titleRu'}
                                            ></Field>
                                        </FormField>
                                        :
                                        <FormField label={item.titleEn} labelFor={`productCharacters.${item.key}`} key={item.key}>
                                            <Field
                                                name={`productCharacters.${item.key}`}
                                                id={item.key}
                                                component={SelectField}
                                                initial={initialValues.productCharacters[item.key]}
                                                options={item.items}
                                                showField={'titleRu'}
                                            ></Field>
                                        </FormField>
                                    ))
                                }

                                <BaseDivider/>

                                <BaseButtons>
                                    <BaseButton type='submit' color='info' label='Submit'/>
                                    <BaseButton type='reset' color='info' outline label='Reset'/>
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
                    }
                </CardBox>
            </SectionMain>
        </>
    );
};

EditProduct.getLayout = function getLayout(page: ReactElement) {
    return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditProduct;
