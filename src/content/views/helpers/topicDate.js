import { format, isSameDay } from 'date-fns';

const current = new Date();

export default function (str) {
    const date = new Date(str);
    if (isSameDay(current, date)) {
        return format(date, 'kk:mm:ss');
    } else {
        return format(date, 'dd/MM/yyyy');
    }
}
