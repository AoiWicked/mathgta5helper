from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
def do_POST(self):
try:
n = int(self.headers.get('Content-Length', '0'))
data = json.loads(self.rfile.read(n) or b'{}')
grid = data['grid']
target = int(data['target'])
res = []
for i in range(len(grid)-1):
for j in range(len(grid[0])-1):
s = grid[i][j] + grid[i][j+1] + grid[i+1][j] + grid[i+1][j+1]
if s == target:
res.append({"i": i, "j": j})
self.send_response(200); self.send_header('Content-Type','application/json'); self.end_headers()
self.wfile.write(json.dumps({"matches": res}).encode())
except Exception as e:
self.send_response(400); self.end_headers(); self.wfile.write(str(e).encode())