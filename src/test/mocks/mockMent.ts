import * as moment from "moment";

export const mockMoment = (date, format) => {
    if (!date) {
        return {
            utc() {
                return {
                    format() {
                        return "2018-10-02T23:38:33Z";
                    },
                };
            },
            format() {
                return "2018-10-02T23:38:33Z";
            },
        };
    }
    return moment(date);
};
