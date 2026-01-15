const isDateInPast = (dateString: string): boolean => {
  const now = new Date();
  const dateToUse = new Date(dateString);
  return dateToUse < now;
}

export { isDateInPast }
