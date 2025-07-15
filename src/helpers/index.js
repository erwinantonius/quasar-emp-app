import { Dark } from 'quasar';

const silence = (form_obj = {}, set_on = true, except = []) => {
    if (set_on)
        form_obj = form_obj.map((m) => {
            m.disabled = true;
            return m;
        });
    else
        form_obj =
            except.length == 0
                ? form_obj.map((m) => {
                      delete m.disabled;
                      return m;
                  })
                : form_obj
                      .map((m) => {
                          delete m.disabled;
                          return m;
                      })
                      .map((m) => {
                          if (except.includes(m.name)) m.disabled = true;
                          return m;
                      });
    return form_obj;
};

const groupArray = (value = [], field = '') => {
    const groupedObj = value.reduce((groups, item) => {
        const keys = field.split('.');
        let value = item;
        for (const k of keys) {
            if (value && value.hasOwnProperty(k)) {
                value = value[k];
            } else {
                value = undefined;
                break;
            }
        }
        const keyValue = JSON.stringify(value);
        const sanitizedKey = keyValue ? keyValue.replace(/^"|"$/g, '') : keyValue;
        if (!groups[sanitizedKey]) {
            groups[sanitizedKey] = {
                items: [],
                length: 0,
            };
        }
        groups[sanitizedKey].items.push(item);
        groups[sanitizedKey].length++;
        return groups;
    }, {});

    return Object.entries(groupedObj).map(([key, value]) => ({
        key,
        value: value.items,
        length: value.length,
    }));
};

const titleCase = (text) => {
    return text
        ? text
              .replace(/_/g, ' ')
              .replace(/(?: |\b)(\w)/g, (s) => s.toUpperCase())
              .replace(/\s+/g, ' ')
        : '';
};

const colorBadge = (state, prop = null) => {
    const colorState = [
        {
            color: 'grey',
            bg_color: 'bg-grey',
            text_color: 'black',
            states: ['draft', 'created'],
        },
        {
            color: 'pink-4',
            bg_color: 'bg-pink',
            text_color: 'white',
            states: ['5 hours'],
        },
        {
            color: 'amber',
            bg_color: 'bg-amber',
            text_color: 'black',
            states: [
                'on_picking',
                'on_progress',
                'in_progress',
                'on_putaway',
                'process',
                'insufficient_stock',
                'process',
            ],
        },
        {
            color: 'amber',
            bg_color: 'bg-amber',
            text_color: 'black',
            states: ['approaching deadline'],
        },
        {
            color: 'red',
            bg_color: 'bg-red',
            text_color: 'white',
            states: ['overdue'],
        },
        {
            color: 'positive',
            bg_color: 'bg-positive',
            text_color: Dark.isActive ? 'black' : 'white',
            states: ['done', 'complete', 'picked', 'ready'],
        },
        { color: 'primary', bg_color: 'bg-pink', text_color: 'white', states: ['pack', 'packed'] },
        { color: 'teal', bg_color: 'bg-teal', text_color: 'white', states: ['pick'] },
        {
            color: 'blue',
            bg_color: 'bg-blue',
            text_color: 'white',
            states: ['paid', 'ready_to_process'],
        },
        {
            color: 'purple',
            bg_color: 'bg-purple',
            text_color: 'white',
            states: ['ready_to_ship', 'ready-to-ship'],
        },
        {
            color: 'deep-purple',
            bg_color: 'bg-deep-purple',
            text_color: 'white',
            states: ['validated', 'shipped'],
        },
        {
            color: 'negative',
            bg_color: 'bg-negative',
            text_color: 'white',
            states: ['cancelled', 'canceled', 'cancel', 'oos', 'out_of_stock'],
        },
    ];

    if (state) {
        const findColor = colorState.find((f) => f.states.includes(state.toLowerCase()));
        if (findColor) {
            if (prop) return findColor[prop];
            return findColor;
        }
    }

    const defaultColor = { color: 'grey', bg_color: 'bg-grey', text_color: 'black' };
    if (prop) return defaultColor[prop];
    return defaultColor;
};

const unwindBy = (arr, f) => {
    return arr.reduce((r, o) => r.concat(o[f].map((v) => ({ ...o, [f]: v }))), []);
};

const validatedPassword = (password) => {
    console.log('validated password');
    const errors = [];
    const minLength = 8;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /[0-9]/;

    if (password.length < minLength) {
        errors.push('Password must be at least 8 characters long.');
    }

    if (!hasUpperCase.test(password)) {
        errors.push('Password must contain at least one uppercase letter.');
    }

    if (!hasLowerCase.test(password)) {
        errors.push('Password must contain at least one lowercase letter.');
    }

    if (!hasNumber.test(password)) {
        errors.push('Password must contain at least one number.');
    }

    return errors;
};

const urlExportLabelJubelio = (url) => {
    try {
        const originalUrl = new URL(url);
        originalUrl.pathname += 'api/export/'; // Add path to pathname
        return originalUrl.toString();
    } catch (error) {
        console.error('Error modifying URL:', error);
        return url; // Return original URL on error
    }
};

const chunkArray = (array, pageSize) => {
    return array.reduce((result, item, index) => {
        const chunkIndex = Math.floor(index / pageSize);

        if (!result[chunkIndex]) {
            result[chunkIndex] = []; // create a new chunk if not exists
        }

        result[chunkIndex].push(item);

        return result;
    }, []);
};

const downloadCsv = (input, filename = 'export') => {
    let filteredData = input.filter((element) => typeof element !== 'boolean');
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += [
        Object.keys(filteredData[0]).join(','),
        ...filteredData.map((item) => Object.values(item).join(',')),
    ].join('\n');

    const data = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', `${filename}.csv`);
    link.click();
};

const wrapCsvValue = (val, formatFn, row) => {
    let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

    formatted = formatted === void 0 || formatted === null ? '' : String(formatted);

    formatted = formatted.split('"').join('""');
    /**
     * Excel accepts \n and \r in strings, but some other CSV parsers do not
     * Uncomment the next two lines to escape new lines
     */
    // .split('\n').join('\\n')
    // .split('\r').join('\\r')

    return `"${formatted}"`;
};

const arrayToCsvContent = (data) => {
    const filteredData = data.filter((element) => typeof element !== 'boolean');
    const contentCsv = [
        Object.keys(filteredData[0])
            .map((m) => wrapCsvValue(m))
            .join(','),
        ...filteredData.map((item) =>
            Object.values(item)
                .map((m) => wrapCsvValue(m))
                .join(','),
        ),
    ].join('\r\n');
    return contentCsv;
};

export {
    silence,
    groupArray,
    titleCase,
    colorBadge,
    unwindBy,
    validatedPassword,
    urlExportLabelJubelio,
    chunkArray,
    downloadCsv,
    arrayToCsvContent,
};
