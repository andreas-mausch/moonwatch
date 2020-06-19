if (process.env.NODE_ENV === 'development') {
  global.tizen = {
    time: {
      getCurrentDateTime: (): TZDate => new Date(),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setTimezoneChangeListener: (): void => {}
    }
  };
}
