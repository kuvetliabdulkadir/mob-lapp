export type Language = 'en' | 'ar' | 'de' | 'ru' | 'es' | 'bg';

export interface LangMeta {
  code: Language;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: LangMeta[] = [
  { code: 'en', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'ar', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'de', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'ru', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'es', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'bg', nativeName: 'Български', flag: '🇧🇬', rtl: false },
];

export interface Translations {
  onboarding: { line1: string; line2: string; start: string };
  home: { addTask: string; completed: string; allDone: string; allDoneSub: string; task: string };
  history: { streak: string; full: string; partial: string; none: string };
  settings: {
    title: string; morning: string; theme: string; dark: string; light: string;
    icon: string; dots: string; lines: string; squares: string; language: string;
  };
  tabs: { today: string; history: string; settings: string };
  days: string[];
  daysShort: string[];
  months: string[];
  notifications: { morning: string; evening: string };
}

export const translations: Record<Language, Translations> = {
  en: {
    onboarding: {
      line1: "You're trying to do everything.",
      line2: "That's why you can't finish anything.",
      start: 'START',
    },
    home: {
      addTask: 'Add task',
      completed: 'COMPLETED',
      allDone: 'All done today!',
      allDoneSub: '3/3 TASKS COMPLETED',
      task: 'Task',
    },
    history: { streak: 'DAY STREAK', full: '3/3', partial: 'Partial', none: '0/3' },
    settings: {
      title: 'Settings', morning: 'MORNING NOTIFICATION', theme: 'THEME',
      dark: 'Dark', light: 'Light', icon: 'APP ICON',
      dots: 'Dots', lines: 'Lines', squares: 'Squares', language: 'LANGUAGE',
    },
    tabs: { today: 'Today', history: 'History', settings: 'Settings' },
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    notifications: { morning: "What are today's 3 tasks?", evening: 'Day is ending. How many did you complete?' },
  },

  ar: {
    onboarding: {
      line1: 'أنت تحاول فعل كل شيء.',
      line2: 'لهذا السبب لا تُنهي أي شيء.',
      start: 'ابدأ',
    },
    home: {
      addTask: 'أضف مهمة',
      completed: 'مكتمل',
      allDone: 'أنجزت كل شيء اليوم!',
      allDoneSub: '٣/٣ مهام مكتملة',
      task: 'مهمة',
    },
    history: { streak: 'سلسلة الأيام', full: '٣/٣', partial: 'جزئي', none: '٠/٣' },
    settings: {
      title: 'الإعدادات', morning: 'إشعار الصباح', theme: 'المظهر',
      dark: 'داكن', light: 'فاتح', icon: 'أيقونة التطبيق',
      dots: 'نقاط', lines: 'خطوط', squares: 'مربعات', language: 'اللغة',
    },
    tabs: { today: 'اليوم', history: 'السجل', settings: 'الإعدادات' },
    days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    daysShort: ['اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت', 'أحد'],
    months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    notifications: { morning: 'ما هي مهامك الثلاث اليوم؟', evening: 'اليوم ينتهي. كم أنجزت؟' },
  },

  de: {
    onboarding: {
      line1: 'Du versuchst, alles zu machen.',
      line2: 'Deshalb schaffst du nichts davon.',
      start: 'LOS',
    },
    home: {
      addTask: 'Aufgabe hinzufügen',
      completed: 'ERLEDIGT',
      allDone: 'Alles geschafft!',
      allDoneSub: '3/3 AUFGABEN ERLEDIGT',
      task: 'Aufgabe',
    },
    history: { streak: 'TAGE-SERIE', full: '3/3', partial: 'Teilweise', none: '0/3' },
    settings: {
      title: 'Einstellungen', morning: 'MORGENBENACHRICHTIGUNG', theme: 'DESIGN',
      dark: 'Dunkel', light: 'Hell', icon: 'APP-SYMBOL',
      dots: 'Punkte', lines: 'Linien', squares: 'Quadrate', language: 'SPRACHE',
    },
    tabs: { today: 'Heute', history: 'Verlauf', settings: 'Einstellungen' },
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    daysShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    notifications: { morning: 'Was sind deine 3 Aufgaben heute?', evening: 'Der Tag endet. Wie viele hast du geschafft?' },
  },

  ru: {
    onboarding: {
      line1: 'Ты пытаешься сделать всё.',
      line2: 'Поэтому ничего не доводишь до конца.',
      start: 'НАЧАТЬ',
    },
    home: {
      addTask: 'Добавить задачу',
      completed: 'ВЫПОЛНЕНО',
      allDone: 'Всё сделано!',
      allDoneSub: '3/3 ЗАДАЧИ ВЫПОЛНЕНЫ',
      task: 'Задача',
    },
    history: { streak: 'ДНЕЙ ПОДРЯД', full: '3/3', partial: 'Частично', none: '0/3' },
    settings: {
      title: 'Настройки', morning: 'УТРЕННЕЕ УВЕДОМЛЕНИЕ', theme: 'ТЕМА',
      dark: 'Тёмная', light: 'Светлая', icon: 'ИКОНКА ПРИЛОЖЕНИЯ',
      dots: 'Точки', lines: 'Линии', squares: 'Квадраты', language: 'ЯЗЫК',
    },
    tabs: { today: 'Сегодня', history: 'История', settings: 'Настройки' },
    days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    notifications: { morning: 'Какие 3 задачи на сегодня?', evening: 'День заканчивается. Сколько выполнил?' },
  },

  es: {
    onboarding: {
      line1: 'Intentas hacerlo todo.',
      line2: 'Por eso no terminas nada.',
      start: 'EMPEZAR',
    },
    home: {
      addTask: 'Añadir tarea',
      completed: 'COMPLETADAS',
      allDone: '¡Todo listo hoy!',
      allDoneSub: '3/3 TAREAS COMPLETADAS',
      task: 'Tarea',
    },
    history: { streak: 'RACHA DIARIA', full: '3/3', partial: 'Parcial', none: '0/3' },
    settings: {
      title: 'Ajustes', morning: 'NOTIFICACIÓN MATUTINA', theme: 'TEMA',
      dark: 'Oscuro', light: 'Claro', icon: 'ICONO DE APP',
      dots: 'Puntos', lines: 'Líneas', squares: 'Cuadrados', language: 'IDIOMA',
    },
    tabs: { today: 'Hoy', history: 'Historial', settings: 'Ajustes' },
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    daysShort: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    notifications: { morning: '¿Cuáles son tus 3 tareas de hoy?', evening: 'El día termina. ¿Cuántas completaste?' },
  },

  bg: {
    onboarding: {
      line1: 'Опитваш се да правиш всичко.',
      line2: 'Затова не довършваш нищо.',
      start: 'НАЧАЛО',
    },
    home: {
      addTask: 'Добави задача',
      completed: 'ЗАВЪРШЕНИ',
      allDone: 'Всичко е готово!',
      allDoneSub: '3/3 ЗАДАЧИ ЗАВЪРШЕНИ',
      task: 'Задача',
    },
    history: { streak: 'ПОРЕДНИ ДНИ', full: '3/3', partial: 'Частично', none: '0/3' },
    settings: {
      title: 'Настройки', morning: 'СУТРЕШНО ИЗВЕСТИЕ', theme: 'ТЕМА',
      dark: 'Тъмна', light: 'Светла', icon: 'ИКОНА НА ПРИЛОЖЕНИЕТО',
      dots: 'Точки', lines: 'Линии', squares: 'Квадрати', language: 'ЕЗИК',
    },
    tabs: { today: 'Днес', history: 'История', settings: 'Настройки' },
    days: ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'],
    daysShort: ['Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб', 'Нед'],
    months: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'],
    notifications: { morning: 'Какви са 3-те ти задачи днес?', evening: 'Денят свършва. Колко завърши?' },
  },
};

export function formatLocalizedDate(date: Date, lang: Language): string {
  const t = translations[lang];
  const dayName = t.days[date.getDay()];
  const monthName = t.months[date.getMonth()];
  const d = date.getDate();
  switch (lang) {
    case 'de': return `${dayName}, ${d}. ${monthName}`;
    case 'es': return `${dayName}, ${d} de ${monthName}`;
    case 'ar': return `${dayName}، ${d} ${monthName}`;
    default:   return `${dayName}, ${d} ${monthName}`;
  }
}

export function getMonthName(month: number, lang: Language): string {
  return translations[lang].months[month];
}

export function getDayShorts(lang: Language): string[] {
  return translations[lang].daysShort;
}
