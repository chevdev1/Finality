export const HUB_PAGE_SIZE = 6;

export function paginate<T>(items: T[], page: number, pageSize = HUB_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (page - 1) * pageSize;
  return {
    pageItems: items.slice(start, start + pageSize),
    totalPages,
  };
}
