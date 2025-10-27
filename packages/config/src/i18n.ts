export const messages = {
  en: {
    welcome: 'Welcome',
    createOrder: 'Create order'
  },
  ru: {
    welcome: 'Добро пожаловать',
    createOrder: 'Создать заказ'
  }
};

export function t(lang: 'en'|'ru', key: string){
  return (messages as any)[lang]?.[key] || key;
}


