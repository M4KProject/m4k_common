/*

import router, { RouterHandler, RouterParams, RouterValue } from './router';
import uuid from '../admin/helpers/uuid';

describe('router', () => {
  let handlerRoute: RouterValue | undefined = undefined;
  const handler: RouterHandler = (route: RouterValue) => {
    handlerRoute = route;
  };

  const testRoute = (path: string, match: string | undefined, params: RouterParams) => {
    const result = router.resolve(path);
    test(`testRoute "${path}"`, () => {
      expect(typeof result).toEqual('object');
      expect(result.match).toEqual(match);
      expect(result.params).toEqual(params);
    });
  };

  testRoute('/', undefined, {});
  testRoute('/my-site', undefined, {});

  router.add('/', handler);
  router.add('/:siteKey', handler);
  router.add('/:siteKey/:sitePage', null);
  router.add('/clear', handler);
  router.add('/admin', handler, { admin: 'dashboard' });
  router.add('/admin/auth', handler, { admin: 'auth' });
  router.add('/admin/site', handler, { admin: 'site' });
  router.add('/admin/:siteKey', handler, { admin: 'site' });
  router.add('/admin/:siteKey/:sitePage', handler, { admin: 'site' });
  router.add('/admin/device', handler, { admin: 'device' });
  router.add('/admin/device/:deviceId', handler, { admin: 'device' });
  router.add('/device', handler);

  testRoute('/', '/', {});
  testRoute('/a', '/:siteKey', { siteKey: 'a' });
  testRoute('/a/b', '/:siteKey/:sitePage', { siteKey: 'a', sitePage: 'b' });
  testRoute('/clear', '/clear', {});
  testRoute('/admin', '/admin', { admin: 'dashboard' });
  testRoute('/admin/auth', '/admin/auth', { admin: 'auth' });
  testRoute('/admin/site', '/admin/site', { admin: 'site' });
  testRoute('/admin/a', '/admin/:siteKey', { admin: 'site', siteKey: 'a' });
  testRoute('/admin/a/b', '/admin/:siteKey/:sitePage', { admin: 'site', siteKey: 'a', sitePage: 'b' });
  testRoute('/admin/device', '/admin/device', { admin: 'device' });
  testRoute('/admin/device/d1', '/admin/device/:deviceId', { admin: 'device', deviceId: 'd1' });
  testRoute('/device', '/device', {});

  test(`router push`, () => {
    expect(router.current.match).toEqual(undefined);
    router.push('/admin');
    expect(router.current).toEqual(handlerRoute);
    expect(router.current.match).toEqual('/admin');
    router.push('/admin/auth');
    expect(router.current).toEqual(handlerRoute);
    expect(router.current.match).toEqual('/admin/auth');
  });

  test(`router back`, () => {
    // router.back();
    // jsdom not implement history.back()
    // expect(location.pathname).toEqual('/admin');
    // expect(router.current).toEqual(handlerRoute);
    // expect(router.current.match).toEqual('/admin');
  });

  test(`router idToKey`, () => {
    const uuid1 = 'a4c63ab4-3b9f-4b35-ba50-6dc03ea02086';
    const { keyToId, idToKey } = router;

    expect(idToKey(uuid1, 'test')).toEqual(uuid1 + '__test');
    expect(idToKey(57, 'test')).toEqual('57__test');
    expect(idToKey(undefined, 'test')).toEqual('__test');
    expect(idToKey(null, 'test')).toEqual('__test');
    expect(idToKey('', 'test')).toEqual('__test');

    expect(keyToId(idToKey(uuid1, 'test'))).toEqual(uuid1);
    expect(keyToId(idToKey(57, 'test'))).toEqual(57);
    expect(keyToId(idToKey(-32, 'test'))).toEqual(-32);
    expect(keyToId(idToKey(-14.2, 'test'))).toEqual(-14.2);
    expect(keyToId(idToKey('-7,6', 'test'))).toEqual(-7.6);
    expect(keyToId(idToKey(0, 'test'))).toEqual(0);
    expect(keyToId(idToKey(undefined, 'test'))).toEqual(undefined);
    expect(keyToId(idToKey(null, 'test'))).toEqual(undefined);
    expect(keyToId(idToKey('', 'test'))).toEqual(undefined);
    expect(keyToId(idToKey('abc', 'test'))).toEqual('abc');
  });
});

// router.add('', (o) => console.debug('app', o));
// router.add(':siteId', (o) => console.debug('site1', o));
// router.add('site/:siteId', (o) => console.debug('site2', o));
// router.add('site/:siteId/:page', (o) => console.debug('site3', o));
// router.add('clear', (o) => console.debug('clear', o));
// router.add('admin', (o) => console.debug('admin1', o));
// router.add('admin/auth', (o) => console.debug('admin2', o));
// router.add('admin/sites', (o) => console.debug('admin3', o));
// router.add('admin/sites/:siteId', (o) => console.debug('admin4', o));
// router.add('admin/devices', (o) => console.debug('admin5', o));
// router.add('admin/devices/:deviceId', (o) => console.debug('admin6', o));
// router.add('device', (o) => console.debug('device', o));
// router.add('device/:siteId', (o) => console.debug('device1', o));
// router.add('device/:siteId/:page', (o) => console.debug('device2', o));

// const testRoute = (test: string, match: string, params?: Record<string, string>) => {
//     const r = router.resolve(test);
//     if (r.match === match) {
//         console.debug(test, match, 'ok', r);
//     } else {
//         console.error(test, match, 'ko', r);
//     }
// }

// testRoute('a', ':siteId');
// testRoute('b', ':siteId');
// testRoute('site/a', 'site/:siteId', { siteId: 'a' });
// testRoute('site/a/b', 'site/:siteId/:page', { siteId: 'a', page: 'b' });
// testRoute('clear', 'clear');
// testRoute('admin', 'admin');
// testRoute('admin/auth', 'admin/auth');
// testRoute('admin/sites', 'admin/sites');
// testRoute('admin/sites/a', 'admin/sites/:siteId', { siteId: 'a' });
// testRoute('admin/devices', 'admin/devices');
// testRoute('admin/devices/a', 'admin/devices/:deviceId', { deviceId: 'a' });
// testRoute('device', 'device');
// testRoute('device/a', 'device/:siteId');
// testRoute('device/a/b', 'device/:siteId/:page');

// router.push('/cosmo/page1');
// router.push('/cosmo/page2');
// router.push('/cosmo/page3');
// router.replace('/cosmo/page4');
// router.push('/cosmo/page5');
// router.back();
// router.back();
// router.push('/cosmo/page6');
// router.back();
// router.push('/cosmo/page7');

*/