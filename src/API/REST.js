
export default new class Api {
    getTickets = async () => {
        const response = await fetch('https://rawgit.com/KosyanMedia/test-tasks/master/aviasales/tickets.json');
        const result = await response.json();

        return result;
    };

    getCurrentCurrency = async () => {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const result = await response.json()

        return result
    };

}();
