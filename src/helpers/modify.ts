
export function removeFromArray(array: any[], element: any): void {
  const optionIndex = array.indexOf(element);

  if (optionIndex >= 0) {
    array.splice(optionIndex, 1);
  }
}
