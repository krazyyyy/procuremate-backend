const fields = [
  'rate',
];
export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/admin/store/index"
  )) as any
  const allowedProducts = [
    ...imports.defaultRelationsExtended,
    ...fields,
  ];
  const defaultProducts = [
    ...imports.defaultStoreProductsFields,
    ...fields,
  ]
  imports.defaultRelationsExtended = defaultProducts
}