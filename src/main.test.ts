describe('main', () => {
  beforeAll(async () => {
    await page.goto('https://joehecn.github.io/share-localstorage/iife.t.html');
  });

  it('should be titled "Document"', async () => {
    const res = await page.evaluate(async () => {
      const shareLocalstorage = window['shareLocalstorage']
      await shareLocalstorage.init()
      const set = await shareLocalstorage.setItem('jest-test', 'jest-test')
      const get1 = await shareLocalstorage.getItem('jest-test')
      const remove = await shareLocalstorage.removeItem('jest-test')
      const get2 = await shareLocalstorage.getItem('jest-test')
      await shareLocalstorage.destory()
      return { set, get1, remove, get2 }
    })
    console.log(res)

    expect(res.get1.keyValue).toBe('jest-test')
    expect(res.get2.keyValue).toBe(null)

    await expect(page.title()).resolves.toMatch('iife test')
  });
});