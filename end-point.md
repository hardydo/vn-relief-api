# Disaster Relief Platform API Documentation
Base URL: /api/v1
=======================

## Authentication: Firebase
- POST `/auth/phone/send-otp`            - Gửi OTP tới số điện thoại
- POST `/auth/phone/verify-otp`          - Xác thực OTP
- POST `/auth/phone/login`               - Đăng nhập bằng số điện thoại + password
- POST `/auth/logout`                    - Đăng xuất

## Users Management
### Users (`/users`)
- GET `/users`                           - Lấy danh sách users
  + Query: 
    - roles: [roleIds] - Filter by roles
    - status: 'active' | 'inactive'
    - search: keyword
- GET `/users/:id`                       - Chi tiết user
- POST `/users`                          - Tạo user mới
	+ body truyền mảng roles lên --> roles = [1,2,3] --> Tạo user có role là 1,2,3 
- PUT `/users/:id`                       - Cập nhật user

### Roles (`/roles`) 
- GET `/roles`                           - Danh sách roles
- GET `/roles/:id`                       - Chi tiết role
- POST `/roles`                          - Tạo role mới
- PUT `/roles/:id`                       - Cập nhật role
- DELETE `/roles/:id`                    - Xóa role
	+ Xoá role thì cũng phải xoá ở bảng user_role: `delete * from user_role where role_id == id`
	+ Đồng thời update role của user --> ví dụ xoá role 1, thì user có roles [1,2,3] phải update thành [2,3]

### User Roles (`/user-roles`)
- GET `/users/:id/roles`                 - Roles của user
- POST `/users/:id/roles`                - Thêm roles cho user
- DELETE `/users/:id/roles/:roleId`      - Xóa role của user

## Natural Disasters Management
### Natural Disasters (`/natural-disasters`)
- GET `/natural-disasters`               - Danh sách đợt thiên tai
  + Query:
    - status: 'ongoing' | 'ended'
    - startDate, endDate
- GET `/natural-disasters/:id`           - Chi tiết đợt thiên tai
- POST `/natural-disasters`              - Tạo đợt thiên tai mới
- PUT `/natural-disasters/:id`           - Cập nhật đợt thiên tai
- DELETE `/natural-disasters/:id`        - Xóa đợt thiên tai (soft delete)
- GET `/natural-disasters/active`        - Đợt thiên tai đang diễn ra

### Disaster Information (`/disaster-information`)
#### Do người dùng đăng ký tài khoản sau vào cập nhật thông tin
- GET `/natural-disasters/:id/information`     - Thông tin thiên tai
- POST `/natural-disasters/:id/information`    - Thêm thông tin
- PUT `/natural-disasters/:id/information/:infoId`  - Cập nhật thông tin
- DELETE `/natural-disasters/:id/information/:infoId` - Xóa thông tin

## Rescue Teams Management
### Rescue Teams (`/rescue-teams`)
- GET `/rescue-teams`                    - Danh sách đội cứu trợ
  + Query:
    - status: 'active' | 'inactive'
- GET `/rescue-teams/:id`                - Chi tiết đội
- POST `/rescue-teams`                   - Tạo đội mới
  + Body: Bao gồm leaderId (người tạo = trưởng nhóm)
- PUT `/rescue-teams/:id`                - Cập nhật thông tin
	+ Chỉ trưởng nhóm mới làm đc
- DELETE `/rescue-teams/:id`             - Giải tán đội
	+ Chỉ trưởng nhóm mới làm đc

- GET `/rescue-teams/:id/members`        - Thành viên đội
- POST `/rescue-teams/:id/members`       - Thêm thành viên
- DELETE `/rescue-teams/:id/members/:userId` - Xóa thành viên

- POST `/rescue-teams/:id/join-requests`     - Gửi yêu cầu tham gia
- GET `/rescue-teams/:id/join-requests`      - Xem yêu cầu tham gia
- PUT `/rescue-teams/:id/join-requests/:requestId` - Phê duyệt/từ chối

- PUT `/rescue-teams/:id/leader/:userId` - Chuyển quyền trưởng nhóm

### Team Rescue Requests (`/team-rescue-requests`)
- GET `/rescue-teams/:id/rescue-requests`   - Danh sách yêu cầu được phân công
- POST `/rescue-teams/:id/rescue-requests/:requestId` - Nhận yêu cầu cứu trợ
- PUT `/team-rescue-requests/:id/status`    - Cập nhật trạng thái xử lý

## Vehicles Management
### Vehicles (`/vehicles`)
- GET `/vehicles`                        - Danh sách phương tiện
  + Query:
    - status: 'available' | 'in_use'
    - type: loại phương tiện
- GET `/vehicles/:id`                    - Chi tiết phương tiện
- POST `/vehicles`                       - Đăng ký phương tiện
- PUT `/vehicles/:id`                    - Cập nhật thông tin
- DELETE `/vehicles/:id`                 - Xóa phương tiện

## Rescue Requests Management
### Rescue Requests (`/rescue-requests`)
- GET `/rescue-requests`                 - Danh sách yêu cầu cứu trợ
  + Query:
    - status: 'pending' | 'verifying' | 'accepted' | 'in_progress' | 'completed'
    - type: 'emergency' | 'supplies' | 'all' | 'others'
    - area: mã địa phương
	- nearby: boolean (Yêu cầu gần đây)
		+ Lọc các yêu cầu cứu trợ gần người dùng (dựa vào vị trí hiện tại người dùng)
		+ --> Dùng cái field "mã địa phương" được format theo dạng string "mã xã, mã huyện, mã tỉnh", lấy về split ra và check
		+ *mỗi vị trí đều có 1 mã xã, mã huyện, mã tỉnh riêng
	
- GET `/rescue-requests/:id`             - Chi tiết yêu cầu
- POST `/rescue-requests`                - Tạo yêu cầu mới
- PUT `/rescue-requests/:id`             - Cập nhật yêu cầu
	+ Chỉ được cập nhật trước khi có đội cứu trợ nhận yêu cầu
	+ Khi có đội A nhận --> không được cập nhật nữa (CHẶN)
- DELETE `/rescue-requests/:id`          - Xóa yêu cầu
	+ Tương tự cái trên, chỉ được xoá khi chưa có đội nào nhận

- PUT `/rescue-requests/:id/verify`      - Xác minh yêu cầu (TNV xác minh)
	+ Cái xác mình này thì TNV (tình nguyện viên) team xac_minh tự kiểm chứng
	+ Và chỉ có TNV role xac_minh mới được phép xác minh, các role khác --> CHẶN
- PUT `/rescue-requests/:id/status`      - Cập nhật trạng thái
	+ Chỉ đội cứu trợ mới có quyền cập nhật trạng thái
	+ Các role khác -> CHẶN
- POST `/rescue-requests/:id/assign/:teamId` - Phân công cho đội
	+ Cái này là TNV role xac_minh có thể phân công đơn cứu trợ cho 1 đội cứu trợ nào đó
	+ Các role khác --> CHẶN

### Rescue Request Items (`/rescue-request-items`)
- GET `/rescue-requests/:id/items`       - Danh sách nhu yếu phẩm cần hỗ trợ của 1 đơn cứu trợ
- POST `/rescue-requests/:id/items`      - Thêm nhu yếu phẩm
- PUT `/rescue-requests/:id/items/:itemId` - Cập nhật số lượng/thông tin
	+ Truyền vào 1 mảng các "chi tiết yêu cầu cứu trợ" và ghi đè cái cũ
	+ Ví dụ đơn cứu trợ A có 3 cái checkbox: 100 cân gạo, 10 cân thịt,...
	+ Khi thao tác form, xoá cái checkbox 10 cân thịt và thay vào đó là 10 cân cá 
	---> Sẽ xoá cái sạch cái cũ "100 cân gạo, 10 cân thịt,..." và ghi mới (create) bằng cái mới "10 cân cá" luôn
- DELETE `/rescue-requests/:id/items/:itemId` - Xóa item

## Support Locations Management 
### Support Locations (`/support-locations`)
- GET `/support-locations`               - Danh sách địa điểm
	+ Get luôn thông tin các hàng hoá đang có ở địa điểm này (bảng "chi tiết đóng góp hàng cứu trợ")
	+ Query:
		- type: "temporary_stop" | "residence" | "warehouse" | "all" | "other"
			+ điểm dừng nghỉ, tạm trú, kho tập kết, khác
		- area: mã địa phương
- GET `/support-locations/:id`           - Chi tiết địa điểm
- POST `/support-locations`              - Thêm địa điểm mới
- PUT `/support-locations/:id`           - Cập nhật thông tin
- DELETE `/support-locations/:id`        - Xóa địa điểm

- POST `/support-locations/:id/receive`  - Tiếp nhận hàng hóa  (tức user mang "phương tiện" tới nhận hàng tại kho)
	+ Truyền body chứa thông tin "phương tiện" nhận hàng 
	+ Body cũng truyền vào là 1 mảng các id "hàng cứu trợ muốn đóng góp" --> Tức là nhận 1 lúc nhiều hàng để chở đi ấy
	+ Đồng thời update trạng thái của các "hàng cứu trợ muốn đóng góp" dựa vào mảng id tuyền body lên (status: Đang vận chuyển)
	+ Đồng thời update trạng thái "lich trinh van chuyen"
	
- POST `/support-locations/:id/distribute` - Phân phối hàng hóa (tức user chở hàng tới nơi phân phát và phát)
	+ Truyền body chứa thông tin "phương tiện" nhận hàng 
	+ Body cũng truyền vào là 1 mảng các id "hàng cứu trợ muốn đóng góp" --> Tức là phát 1 lúc nhiều hàng cho hộ dân
	+ Đồng thời update trạng thái của các "hàng cứu trợ muốn đóng góp" dựa vào mảng id tuyền body lên (status: Đang phân phát)
	+ Khi nào phát xong thì người dùng tự update trạng thái lên "Đã phân phát xong"
	+ Đồng thời update trạng thái "lich trinh van chuyen"

- GET `/support-locations/nearby`        - Tìm điểm gần nhất
		+ Lọc các điểm hỗ trợ gần người dùng (dựa vào vị trí hiện tại người dùng)
		+ --> Dùng cái field "mã địa phương" được format theo dạng string "mã xã, mã huyện, mã tỉnh", lấy về split ra và check
		+ *mỗi vị trí đều có 1 mã xã, mã huyện, mã tỉnh riêng. Ví dụ triều khúc, thanh trì, hà nội thì field wardCode lưu là "01 | 32 | 12" (giả sử triều khúc là 01, thanh trì là mã 32, hà nội mã 12 - cái này có data trên google, search là thấy)

## Relief Contributions Management
### Relief Contributions (`/relief-contributions`)
- GET `/relief-contributions`            - Danh sách đóng góp
  + Query:
    - type: 'money' | 'supplies' | 'other'
    - status: 'pending' | 'received' | 'distributed'
- GET `/relief-contributions/:id`        - Chi tiết đóng góp
- POST `/relief-contributions`           - Tạo đóng góp mới
	+ Body truyền lên số điện thoại của người donation (nguoi_dung) + id của "địa điểm cứu trợ" --> Người A có sđt 091231231 mang hàng tới "địa điểm Bắc Ninh"
	+ Nếu nguoi_dung chưa có account 
		+ Thì dựa vào sđt tạo luôn 1 account với role thanh_vien_thuong 
		+ Nhớ là phải gửi mã code về sđt đó, thì mới cho tạo account --> cái này là phần Đăng ký (nghiên cứu firebase có gửi code về sđt)
- PUT `/relief-contributions/:id`        - Cập nhật đóng góp
- DELETE `/relief-contributions/:id`     - Xóa đóng góp

### Contribution Details (`/contribution-details`)
- Ví dụ Người dân mang 100 cân gạo, 10 cân thịt tới điểm A
	+ Bảng "relief-contributions" chỉ lưu là Gạo, thịt
	+  còn bảng này ("Chi tiết đóng góp cứu trợ") sẽ lưu số lượng 100 cân, 10 cân
		
- GET `/relief-contributions/:id/details`  - Chi tiết items đóng góp của 1 đơn đóng góp
	+ Hàng cứu trợ Gạo, thịt, cá 
		+ --> Thì "chi tiết id" = 1 --> hàng đóng góp id = 1 --> quantity: 100 (100 cân gạo)
		+ --> Thì "chi tiết id" = 2 --> hàng đóng góp id = 1 --> quantity: 10 (100 cân thịt)
		+ --> Thì "chi tiết id" = 3 --> hàng đóng góp id = 1 --> quantity: 17 (17 cân cá)
		
- POST `/relief-contributions/:id/details` - Thêm items
- PUT `/relief-contributions/:id/details/:detailId` - Cập nhật item
- DELETE `/relief-contributions/:id/details/:detailId` - Xóa item

## Transport Management
### Transports (`/transports`)
- GET `/transports`                      - Danh sách vận chuyển
  + Query:
    - status: 'pending' | 'in_progress' | 'completed'
    - vehicleId
    - startDate, endDate
- GET `/transports/:id`                  - Chi tiết vận chuyển
	+ Phương tiện A, chủ xe B, đang chở hàng cứu trợ C, đi tới điểm D, thời gian...
- POST `/transports`                     - Tạo vận chuyển mới
- PUT `/transports/:id`                  - Cập nhật thông tin
- DELETE `/transports/:id`               - Hủy vận chuyển

### Transport Histories (`/transport-histories`) 
- GET `/transports/:id/histories`        - Lịch sử vận chuyển
- POST `/transports/:id/histories`       - Thêm điểm check-in mới
- PUT `/transports/:id/histories/:historyId` - Cập nhật trạng thái

### Transport Supplies (`/transport-supplies`)
- GET `/transports/:id/supplies`         - Danh sách hàng đang vận chuyển
- POST `/transports/:id/supplies`        - Thêm hàng vào chuyến
- DELETE `/transports/:id/supplies/:supplyId` - Xóa hàng khỏi chuyến
- PUT `/transports/:id/supplies/:supplyId/status` - Cập nhật trạng thái

## Financial Management
### Financial Transactions (`/transactions`)
- GET `/transactions`                    - Danh sách giao dịch
  + Query:
    - type: 'bank' | 'cash'
    - startDate, endDate
- GET `/transactions/:id`                - Chi tiết giao dịch

- POST `/transactions/cash`              - Ghi nhận giao dịch tiền mặt
	+ Cái này thì xin sđt + thông tin người dân --> Sẽ tạo 1 account với sđt người dân đó NHƯNG KHÔNG CẦN XÁC MINH GÌ HẾT
	+ Mục đích để sao kê ra thui

- PUT `/transactions/cash/:id`           - Cập nhật giao dịch tiền mặt

### Online Payment --> Dùng VNPAY dev, hoặc 1 bên nào đó cho thực tế --> Cái này để em làm
- POST `/transactions/vnpay/create`      - Tạo giao dịch VNPAY
- POST `/transactions/vnpay/callback`    - Callback VNPAY
- GET `/transactions/payment-methods`    - Danh sách phương thức thanh toán

## System Management
### Status History (`/status-histories`)
- GET `/status-histories/:table/:id`     - Lịch sử của một record
	+ table là tên bảng
	+ id là id trong cái bảng đó

### Table Status (`/table-status`)
- GET `/table-status/:table`             - Lấy ra các trạng thái của bảng
	+ :table là tên bảng

### Notifications (`/notifications`): ĐỂ CUỐI, NẾU KỊP THÌ LÀM

## Statistics & Reports
- GET `/statistics/rescue-teams`         - Thống kê đội cứu trợ
- GET `/statistics/contributions`        - Thống kê đóng góp
- GET `/statistics/rescue-requests`      - Thống kê yêu cầu cứu trợ
- GET `/statistics/transport`            - Thống kê vận chuyển