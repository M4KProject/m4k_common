export class NotImplemented extends Error {
  constructor(name: string) {
    super(name ? `${name} is not implemented` : 'not implemented');
  }
}
