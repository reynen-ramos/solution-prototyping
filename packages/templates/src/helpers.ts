import Handlebars from 'handlebars';

export function registerHelpers() {
  Handlebars.registerHelper('eq', (a, b) => a === b);
  Handlebars.registerHelper('neq', (a, b) => a !== b);
  Handlebars.registerHelper('lower', (s: string) => s?.toLowerCase());
  Handlebars.registerHelper('upper', (s: string) => s?.toUpperCase());
  Handlebars.registerHelper('capitalize', (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
  Handlebars.registerHelper('camelCase', (s: string) => {
    if (!s) return '';
    return s.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
  });
  Handlebars.registerHelper('pascalCase', (s: string) => {
    if (!s) return '';
    const camel = s.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  });
  Handlebars.registerHelper('kebabCase', (s: string) => {
    if (!s) return '';
    return s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]+/g, '-').toLowerCase();
  });
  Handlebars.registerHelper('json', (obj: unknown) => JSON.stringify(obj, null, 2));
  Handlebars.registerHelper('ifCond', function (this: unknown, v1: unknown, operator: string, v2: unknown, options: Handlebars.HelperOptions) {
    switch (operator) {
      case '==': return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===': return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=': return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '>': return (v1 as number) > (v2 as number) ? options.fn(this) : options.inverse(this);
      default: return options.inverse(this);
    }
  });
  Handlebars.registerHelper('join', (arr: string[], sep: string) => {
    if (!Array.isArray(arr)) return '';
    return arr.join(typeof sep === 'string' ? sep : ', ');
  });
}
