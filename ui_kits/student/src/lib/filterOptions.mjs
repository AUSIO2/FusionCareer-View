export function filterOptions(options, query) {
  const keyword = query.trim().toLowerCase()
  return keyword ? options.filter(option => option.toLowerCase().includes(keyword)) : options
}
