import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '5m', target: 100 }, // Ramp up to 50 users over 1 minute
        { duration: '10m', target: 100 }, // Stay at 50 users for 3 minutes
        { duration: '5m', target: 0 },  // Ramp down to 0 users over 1 minute
    ],
    thresholds: {
        'http_req_duration': ['p(95)<50'],  // 95% of requests should complete below 500ms
        'http_req_failed': ['rate<0.01'],    // Error rate should be less than 1%
    },
};
export default function () {
    const prodUrl = 'https://api01.awfatech.com'
    const url = `${prodUrl}/api/v2/leave/eboss/staff/on-leave-staff-list` 
    const payload = JSON.stringify({
        action: "on_leave_staff_list",
        // filter_month: "07",
        // filter_year: "2024",
        // filter_search: "",
        // page_limit: 10,
        // page_start: 1,
        // page_order: "id",
        // page_sort: "desc"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'x-encrypted-key': '.',
            'x-encrypted-user': '.',
            'Authorization': 'Bearer .',
        },
    };
    // Send the POST request
    const response = http.post(url, payload, params);

    // Check for successful response before parsing JSON
    // if (response.status === 200) {
    //     // Handle successful response (might not be JSON)
    //     // console.log(response.body);
    // } else {
    //     // console.error(`Error: ${response.status} - ${response.body}`);
    // }

    // Check for a successful response
    check(response, {
        'is status 200': (r) => r.status === 200,
        'is status 500': (r) => r.status === 500,
        'is status 502': (r) => r.status === 502,
        // 'is success': (r) => r.json().success === true,
        'response time < 50ms': (r) => r.timings.duration < 50,
    });

    // Handle specific error cases
    if (response.status === 400) {
        console.error(`VU ${__VU}: Bad request: ${response.body}`);
    } else if (response.status === 500) {
        console.error(`VU ${__VU}: Internal server error: ${response.body}`);
    } else if (response.status === 502) {
        console.error(`VU ${__VU}: Bad gateway: ${response.body}`);
    }

    // Log the response for debugging purposes
    // console.log(`Response status: ${response.status}`);
    // console.log(`Response body: ${response.body}`);
    sleep(1);
}