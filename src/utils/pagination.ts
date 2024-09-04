interface Props {
  path: string;
  page: number;
  limit: number;
  total: number;
}

export const pagination = (params: Props) => {
  const { limit, page, total, path } = params;

  const next =
    page * limit < total
      ? `/api/${path}?page=${page + 1}&limit=${limit}`
      : null;

  const prev =
    page - 1 > 0 ? `/api/${path}?page=${page - 1}&limit=${limit}` : null;

  return { next, prev };
};
