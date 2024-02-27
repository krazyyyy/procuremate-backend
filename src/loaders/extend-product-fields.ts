const fields = [
  'seo_description',
  'canonical_url',
  'page_title',
  'main_image',
  'comment'
];
export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/index"
  )) as any
  const allowedProducts = [
    ...imports.allowedStoreProductsFields,
    ...imports.allowedStoreProductsFields,
    ...fields,
  ];
  const defaultProducts = [
    ...imports.defaultStoreProductsFields,
    ...fields,
  ]
  imports.allowedStoreProductsFields = allowedProducts
  imports.defaultStoreProductsFields = defaultProducts
}