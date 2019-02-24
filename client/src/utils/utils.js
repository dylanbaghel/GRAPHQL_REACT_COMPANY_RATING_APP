import jwt_decode from 'jwt-decode';
import moment from 'moment';

export const getUserId = (token) => {
    const decoded = jwt_decode(token);
    return decoded.userId;
};

export const getUserInfo = (token) => {
    const decoded = jwt_decode(token);
    return decoded;
};

export const getFullDateTime = (dateTime) => {
    return moment(dateTime).format("ddd, Do MMM YYYY, h:mm a");
};