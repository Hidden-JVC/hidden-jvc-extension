import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function (str) {
    return format(new Date(str), 'dd MMMM yyyy à kk:mm:ss', { locale: fr });
}
