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
            'x-encrypted-key': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0X25hbWUiOiJBd2ZhdGVjaCBHbG9iYWwgU2RuIEJoZCIsImFwcF9jb2RlIjoic2hhaGFsYW0iLCJhcHBfbmFtZSI6IkFTSVMgKyBFQk9TUyIsInNpZCI6IjAiLCJhcHBlbmdpbmUiOiJodHRwczovL21vYmlnYXRlLmF3ZmF0ZWNoLmNvbS9hcHBfYXNpc3YzIiwidXJsIjoiaHR0cHM6Ly9zaGFoYWxhbS5hd2ZhdGVjaC5jb20vZWJvc3MiLCJkYl9uYW1lIjoic2hhaGFsYW1fZWJvc3MiLCJkYl9uYW1lMiI6IiIsImhvc3QiOiI0My4yNTIuMzYuMTkxIiwiY3NpZCI6IjE2OTYyMjYyODYiLCJpYXQiOjE3MzEyODkxNjIsIm5iZiI6MTczMTI4OTEzMiwiYXVkIjoidXNlciIsImlzcyI6ImF3ZmF0ZWNoIGdsb2JhbCIsInN1YiI6ImFwcGNvZGUifQ.LUAOosCZRCaZDvgNuPYRAipQfxPy3Hll_ZHyg-BlLJImUYTXP_ScK5hfarqd55dTh20nUh94tNFmo_RuouyCosrvuHPSkpOwemZn7OUVEXUTUEyDTkMo6vRBc0D6ln3hPL96YAfErQ-u0V-V_cIn8hCA1ZKm0TH-xU7_c54_aDY2zxzec-BKPJlwihJfIl4OmuK9iDNriQGyL78X1pgf3LQJwo-egR8IJxnlJoNo229YUp9nxaz4AgeWgU_vjI5IhE15EAK-uP_KfI0Ynl72WQ3qoSx42GCXTFVGFsKiLR9P79KCQ_g3zKmFAXcGkngi9fTqQVDTfD5wKWRvXqdBmA',
            'x-encrypted-user': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidGVzdHVzZXIiLCJ1c2VyX3NpZCI6MCwidXNlcl9uYW1lIjoic2hhaCAodGVzdCB1c2VyKSIsInN5c3RlbV9hY2Nlc3MiOiJLRVl8aHJtc3xlc3RhZmZ8bGVhdmV8bGVhdmVhZG1pbnxzYWxhcnl8c2FsYXJ5YWRtaW58Y2xhaW18bG9nfGZpbmFuY2V8YmlsbGluZ3xmaW5hZG1pbnxwYXltZW50fGNvbGxlY3Rpb258ZmlucmVwb3J0fGVzbXN8c2FsZXN8aGVscGRlc2t8Y3JtfG1vYmlsZWNoYXR8d29ya29yZGVyfGdhfG1haW50ZW5hbmNlfGFzc2V0fGFzc2V0YWRtaW58aW52ZW50b3J5fGludmVudG9yeWFkbWlufGtiYXNlYWRtaW58a2Jhc2V8a2FyaWFofGtoYWlyYXR8bWFpbnRlbmFuY2VhZG1pbnxkYXNoYm9hcmR8Y21zfGFsdW1uaXxuYXppcmFkbWlufG5hemlyfGxldHRlcmFkbWlufGVxdWFsaXR5fGJvb2tpbmd8Ym9va2luZ2FkbWlufG5ld3NldmVudHxyZWdpc3Rlcnxob3N0ZWx8a29xfGVydW1haHxkaXNjaXBsaW5lfGV4YW18c3R1cHJvfGF0dGVuZGFuY2V8cXVyYW5pY3xycGh8bWFuYWdlbWVudHxoZWFkY291bnR8aG9tZXdvcmt8cmVhZGluZ3xvYnNlcnZhdGlvbnxleGFtaGFmfHNwZWNpYWxyZWFkaW5nfGZlZXxmZWVhZG1pbiIsInN5c3RlbV9sZXZlbCI6IkFETUlOIiwiaWF0IjoxNzMxMjg5MjQxLCJuYmYiOjE3MzEyODkyMTEsImF1ZCI6InVzZXIiLCJpc3MiOiJhd2ZhdGVjaCBnbG9iYWwiLCJzdWIiOiJnZW5lcmFsIn0.oyu9nOgYfmOhDFZr39r7GBlvn4GfHMsgxfJ-U1PE2kyHU1APiFER57R7-a5MWnpBZR_14yOKX21j3Rw2jpJKpHEqdVK0IG4hpXCfGcJAsDgBlBZpZnaLnzVWmEyH5eXAbkJQsuqK_FBgwJBpy2QUD6RkwTW0vjSbLCnDPwEm5_qZ99xqbx3giK6n_Mi0YGUpp4pYEPNvLEL4xbQj_r4k0dDbbAeiTrbz4AOS1iAWZ2YZGIexpkZj1szg1fhHDOX7YBhhfdRPpdFRYYGb0PEyqktz7FohjN_R5SnpsXrfniPzWnbeP6wPtFPU2vv11lVHtNY1HjjXoYh2OBSJoxdpag',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3R1c2VyIiwiaWRzZXJ2ZXIiOiIxNjk2MjI2Mjg2IiwiaWF0IjoxNzMxMjg5MjQxLCJuYmYiOjE3MzEyODkyMTEsImV4cCI6MTczMzg4MTI0MSwiYXVkIjoidXNlciIsImlzcyI6ImF3ZmF0ZWNoIGdsb2JhbCIsInN1YiI6ImF1dGgifQ.nOXb0AsPNiIOaeMT-49mA_1kU8fM1FvRw5UVmbsQLmWVFegJNkMZsIic7AqBXKoDWMO16SfqzMUX6Inj_MlalxVehcssFDVOz427971ESNBhgUnmrXP5H6dwIAUJ6fBDB4YkgX3qiAPvC6oajOdR9fvMTYz4fIhPYpjlxM2BnTex6s-T_arP7RpSaGJ4OM65C4_6C2-RZA5_80euuKq9f3ca8z7En-LctI2LRfoHLQ40Dp00ZSDXFYmQ7SElJOdmBZ_d3qHWRDkPvRoho4cTAikzYM0cOSgCvgjTXeLl1RUvjHVc-9khVxbRi6gUCqi7BMCeiZwDFg2_DKfoTavHAQ'
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