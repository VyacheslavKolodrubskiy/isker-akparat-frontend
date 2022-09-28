
function hasQuery(routeRecord) {
  return !!Object.keys(routeRecord.query).length;
}

export function setFromRedirect(to, from) {
  if (!hasQuery(to)) {
    return { name: to.name, query: { redirect: from.fullPath }, hash: from.hash, replace: true };
  }
  // else if (from.name === to.name && hasQuery(from)) {
  //   return { name: to.name, query: from.query, hash: from.hash, replace: true };
  // }
}

// export function redirectOnRefreshPage(to, from) {
//   if (!from.name && !to.redirectedFrom) {
//     return { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
//   }
// }
