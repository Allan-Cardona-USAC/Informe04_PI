const BASE = 'http://localhost:4000/api';

export async function api(path, { method='GET', body, auth=false } = {}){
  const headers = { 'Content-Type': 'application/json' };
  if (auth){
    const t = localStorage.getItem('token');
    if (t) headers['Authorization'] = 'Bearer ' + t;
  }
  const res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error((await res.json()).message || 'Error');
  return res.json();
}
