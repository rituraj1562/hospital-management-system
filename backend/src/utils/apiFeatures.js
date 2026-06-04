export function buildQuery(modelQuery, queryParams) {
  const { page = 1, limit = 20, sort = '-createdAt', search, fields, ...filters } = queryParams;
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
  );

  let query = modelQuery.find(cleanFilters);

  if (search) {
    query = query.find({ $text: { $search: search } });
  }

  if (fields) query = query.select(String(fields).split(',').join(' '));
  query = query.sort(String(sort).split(',').join(' '));
  query = query.skip((Number(page) - 1) * Number(limit)).limit(Number(limit));

  return query;
}
