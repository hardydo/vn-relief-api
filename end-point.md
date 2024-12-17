# Endpoint cứu trợ thiên tai:
Base URL: /api/v1
=======================

## Authentication: Dùng firebase làm authen sđt

## Đợt Thiên tai (`/natural-disasters`)
- GET `/natural-disasters`                    - Lấy danh sách đợt thiên tai
- GET `/natural-disasters/:id`                - Lấy chi tiết đợt thiên tai
- POST `/natural-disasters`                   - Tạo đợt thiên tai mới
- PUT `/natural-disasters/:id`                - Cập nhật đợt thiên tai
- DELETE `/natural-disasters/:id`             - Xóa đợt thiên tai
	+ Xoá mềm (soft delete)
- GET `/natural-disasters/active`             - Lấy đợt thiên tai đang diễn ra

### Thông tin Thiên tai: 
#### Do người dùng đăng ký tài khoản sau vào cập nhật thông tin
- GET `/natural-disasters/:id/info`           - Lấy thông tin của đợt thiên tai
- POST `/natural-disasters/:id/info`          - Thêm thông tin cho đợt thiên tai
- PUT `/natural-disasters/:id/info/:infoId`   - Cập nhật thông tin
- DELETE `/natural-disasters/:id/info/:infoId` - Xóa thông tin

## Người dùng (`/users`)
- GET `/users`                         		- Lấy danh sách người dùng
	+ Body truyền mảng roles nhá:
		+ roles `all`: Lấy hết danh sách người dùng
		+ roles `1 role nào đó`: Lấy danh sách người dùng theo role
			+ ví dụ roles = [1,2] --> Lấy danh sách người dùng có role là 1 và 2
- GET `/users/:id`                           - Lấy chi tiết người dùng
- POST `/users/roles`                        - Tạo người dùng mới
	+ Tương tự, body truyền mảng roles lên 
	+ roles = [1,2,3] --> Tạo user có role là 1,2,3
- PUT `/users/:id`                           - Cập nhật thông tin người dùng
- POST `/users/:id/type`					 - Block/Unlock người dùng (spam/lừa đảo)
	+ type: `blocked`: Khoá tài khoản
	+ type: `unlocked`: Mở khoá tài khoản
	
- GET `/users/:id/rescue-teams`               - Lấy đội cứu trợ của user
- POST `/users/:id/rescue-teams/:teamId/join` - Xin tham gia đội
- PUT `/users/:id/rescue-teams/:teamId/leave` - Rời đội
- GET `/users/:id/leader-teams`               - Lấy đội mà user đang làm trưởng nhóm

### Quản lý Roles
- GET `/roles`								 - Lấy danh sách các role của web
- POST `/roles`								 - Thêm role mới 
- PUT `/roles/:id`							 - Sửa role 
- DELETE `/roles/:id`							 - Xoá role
	+ Xoá role thì cũng phải xoá ở bảng user_role: `delete * from user_role where role_id == id`

- GET `/users/:id/roles`                     - Lấy danh sách roles của user
- POST `/users/:id/roles`                    - Thêm role cho user
- DELETE `/users/:id/roles/:roleId`          - Xóa role của user

## Đội Cứu trợ (`/rescue-teams`)
- GET `/rescue-teams`                        - Lấy danh sách đội 
- GET `/rescue-teams/:id`                    - Chi tiết đội
- POST `/rescue-teams`                       - Tạo đội mới
	+ Body phải truyền lên userId để xem ai tạo đội --> và người đó là trưởng nhóm luôn
- PUT `/rescue-teams/:id`                    - Cập nhật thông tin đội
	+ Chỉ trưởng nhóm mới làm đc
- DELETE `/rescue-teams/:id`                 - Giải tán đội
	+ Chỉ trưởng nhóm mới làm đc

- GET `/rescue-teams/:id/members`            - Danh sách thành viên
- POST `/rescue-teams/:id/members`           - Thêm thành viên
- DELETE `/rescue-teams/:id/members/:userId` - Xóa thành viên
- PUT `/rescue-teams/:id/leader/:userId`     - Chuyển quyền đội trưởng cho thành viên khác
- GET `/rescue-teams/:id/requests`           - Xem yêu cầu tham gia
- PUT `/rescue-teams/:id/requests/:reqId`    - Duyệt/từ chối yêu cầu

- GET `/rescue-teams/:id/missions`           - Xem các nhiệm vụ cứu trợ của đội
- GET `/rescue-teams/:id/active-missions`    - Nhiệm vụ đang thực hiện
- POST `/rescue-teams/:id/missions`          - Nhận nhiệm vụ mới
- PUT `/rescue-teams/:id/missions/:missionId`- Cập nhật tiến độ cứu trợ

### Phương tiện và lịch trình vận chuyển
- GET `/vehicles`           			 	 - Danh sách tất cả phương tiện
- GET `/vehicles/:id`           			 - Chi tiết phương tiện
- POST `/vehicles`							 - Đăng ký phương tiện
- PUT `/vehicles/:id`						 - Sửa thông tin phương tiện 
- DELETE `/vehicles/:id` 					 - Xoá phương tiện

## Yêu cầu Cứu trợ (`/rescue-requests`)
- GET `/rescue-requests/:type`               - Danh sách yêu cầu
	+ type `all`: Lấy hết các yêu cầu 
	+ type `Đang xác minh`: Lấy hết các yêu cầu đang xác minh
	... tương tự các type khác
- GET `/rescue-requests/:id`                 - Chi tiết yêu cầu
- POST `/rescue-requests`                    - Tạo yêu cầu mới
- PUT `/rescue-requests/:id`                 - Cập nhật yêu cầu
	+ Chỉ được cập nhật trước khi có đội cứu trợ nhận yêu cầu
	+ Khi có đội A nhận --> không được cập nhật nữa (CHẶN)
- DELETE `/rescue-requests/:id`              - Xóa yêu cầu
	+ Tương tự cái trên, chỉ được xoá khi chưa có đội nào nhận
- PUT `/rescue-requests/:id/verify`          - Xác minh yêu cầu
	+ Cái xác mình này thì TNV (tình nguyện viên) team xac_minh tự kiểm chứng
	+ Và chỉ có TNV role xac_minh mới được phép xác minh, các role khác --> CHẶN
- PUT `/rescue-requests/:id/status`          - Cập nhật trạng thái của đơn cứu trợ
	+ Chỉ đội cứu trợ mới có quyền cập nhật trạng thái
	+ Các role khác -> CHẶN
- POST `/rescue-requests/:id/team/:teamId/assign` - Phân công yêu cầu cứu trợ cho 1 đội cứu trợ nào đó
	+ Cái này là TNV role xac_minh có thể phân công đơn cứu trợ cho 1 đội cứu trợ nào đó
	+ Các role khác --> CHẶN

- GET `/rescue-requests/:id/items`           - Danh sách hàng cứu trợ của 1 đơn cứu trợ
- PUT `/rescue-requests/:id/items/:itemId`   - Cập nhật hàng cứu trợ
	+ Truyền vào 1 mảng các "chi tiết hàng cứu trợ" và ghi đè cái cũ
	+ Ví dụ đơn cứu trợ A có 3 cái checkbox: 100 cân gạo, 10 cân thịt,...
	+ Khi thao tác form, xoá cái checkbox 10 cân thịt và thay vào đó là 10 cân cá 
	---> Sẽ xoá cái sạch cái cũ "100 cân gạo, 10 cân thịt,..." và ghi mới (create) bằng cái mới "10 cân cá" luôn

- GET `/rescue-requests/by-status/:status`   	- Lọc theo trạng thái
	+ Lọc đơn cứu trợ theo trạng thái đơn (đã xác minh, đang đợi xác minh, đã từ chối)
- GET `/rescue-requests/by-location/:location`  - Lọc theo địa điểm
- GET `/rescue-requests/nearby`              	- Yêu cầu gần đây
	+ Lọc các yêu cầu cứu trợ gần người dùng (dựa vào vị trí hiện tại người dùng)
	--> Dùng cái field "mã địa phương" được format theo dạng string "mã xã, mã huyện, mã tỉnh", lấy về split ra và check
	*mỗi vị trí đều có 1 mã xã, mã huyện, mã tỉnh riêng

## Địa điểm Hỗ trợ (`/support-locations`)
- GET `/support-locations`                   - Danh sách địa điểm
- GET `/support-locations/:id`               - Chi tiết địa điểm
	+ Get luôn thông tin các hàng hoá đang có ở địa điểm này (bảng "chi tiết đóng góp hàng cứu trợ")
- POST `/support-locations`                  - Thêm địa điểm mới
- PUT `/support-locations/:id`               - Cập nhật thông tin
- DELETE `/support-locations/:id`            - Xóa địa điểm

- GET `/support-locations/by-type/:type`     - Lọc địa điểm theo loại
	+ type: /rest-stops --> Điểm dừng chân
	+ type: /shelters --> Điểm tạm trú
	+ type: /collection-points --> Điểm tập kết
	
- POST `/support-locations/receive`      - Nhận hàng (tức user mang "phương tiện" tới nhân hàng)
	+ Truyền body chứa thông tin "phương tiện" nhận hàng 
	+ Body cũng truyền vào là 1 mảng các id "hàng cứu trợ muốn đóng góp" --> Tức là nhận 1 lúc nhiều hàng để chở đi ấy
	+ Đồng thời update trạng thái của các "hàng cứu trợ muốn đóng góp" dựa vào mảng id tuyền body lên (status: Đang vận chuyển)
	+ Đồng thời update trạng thái "lich trinh van chuyen"
	
- POST `/support-locations/:id/rescue-requests/:id/distribute`   - Phát hàng (tức user chở hàng tới nơi phân phát và phát)
	+ Truyền body chứa thông tin "phương tiện" nhận hàng 
	+ Body cũng truyền vào là 1 mảng các id "hàng cứu trợ muốn đóng góp" --> Tức là phát 1 lúc nhiều hàng cho hộ dân
	+ Đồng thời update trạng thái của các "hàng cứu trợ muốn đóng góp" dựa vào mảng id tuyền body lên (status: Đang phân phát)
	+ Khi nào phát xong thì người dùng tự update trạng thái lên "Đã phân phát xong"
	+ Đồng thời update trạng thái "lich trinh van chuyen"

- GET `/support-locations/nearby/:coordinates` - Tìm "địa điểm hỗ trợ" gần nhất

## Hàng Cứu trợ (`/donation-items`): Người dân mang hàng tới "địa điểm hỗ trợ" 
- GET `/donation-items/:userId`                  - Chi tiết hàng đóng góp của 1 user tới "địa điểm hỗ trợ"
- POST `/donation-items`                     	 - Thêm hàng mới
	+ Body truyền lên số điện thoại của người donation (nguoi_dung) + id của "địa điểm cứu trợ" --> Người A có sđt 091231231 mang hàng tới "địa điểm Bắc Ninh"
	+ Nếu nguoi_dung chưa có account 
		+ Thì dựa vào sđt tạo luôn 1 account với role thanh_vien_thuong 
		+ Nhớ là phải gửi mã code về sđt đó, thì mới cho tạo account --> cái này là phần Đăng ký (nghiên cứu firebase có gửi code về sđt)
- PUT `/donation-items/:id`                  - Cập nhật thông tin hàng
	+ Tăng/Giảm số lượng hàng
	+ Thêm hàng...
- DELETE `/donation-items/:id`               - Xóa hàng

### Chi tiết hàng cứu trợ (`/donation-items-detail`): Chi tiết hàng cứu trợ của hàng người dân mang tới "địa điểm hỗ trợ" 
- Ví dụ Người dân mang 100 cân gạo, 10 cân thịt tới điểm A
	+ Bảng "Hàng cứu trợ" chỉ lưu là Gạo, thịt
	+  còn bảng này ("Chi tiết hàng cứu trợ") sẽ lưu số lượng 100 cân, 10 cân

- GET `/donation-items/:id/detail`			- Chi tiết các items trong 1 "hàng cứu trợ" 
	+ Hàng cứu trợ Gạo, thịt, cá 
		+ --> Thì "chi tiết id" = 1 --> hàng cứu trợ id = 1 --> quantity: 100 (100 cân gạo)
		+ --> Thì "chi tiết id" = 2 --> hàng cứu trợ id = 1 --> quantity: 10 (100 cân thịt)
		+ --> Thì "chi tiết id" = 3 --> hàng cứu trợ id = 1 --> quantity: 17 (17 cân cá)

## Lịch trình Vận chuyển (`/transport-schedules`)
- GET `/transport-schedules`                 - Danh sách lịch trình
	+ Phương tiện A, chủ xe B, đang chở hàng cứu trợ C, đi tới điểm D, thời gian...
- GET `/transport-schedules/:id`             - Chi tiết lịch trình
- PUT `/transport-schedules/:id`             - Cập nhật lịch trình
- DELETE `/transport-schedules/:id`          - Xóa lịch trình

## Giao dịch Tài chính (`/transactions`)
- GET `/transactions`                        - Danh sách giao dịch
- GET `/transactions/:id`                    - Chi tiết giao dịch

### Tiền mặt
- POST `/donations/cash/record`              - Ghi nhận tiền mặt từ người dân đóng góp
- PUT `/donations/cash/record`               - Sửa thông tin tiền mặt từ người dân đóng góp
	+ Cái này thì xin sđt + thông tin người dân --> Sẽ tạo 1 account với sđt người dân đó NHƯNG KHÔNG CẦN XÁC MINH GÌ HẾT
	+ Mục đích để sao kê ra thui

### Chuyển khoản (dùng VNPay developer) --> Cái này để em làm
- POST `/transactions/vnpay/create`          - Tạo giao dịch VNPAY
- POST `/transactions/vnpay/callback`        - Callback VNPAY
- POST `/transactions/cash/record`           - Ghi nhận tiền mặt
- GET `/transactions/payment-methods`        - Phương thức thanh toán

## System Management: ĐỂ CUỐI, NẾU KỊP THÌ LÀM
- GET `/logs`                               - Xem logs

### Notifications: ĐỂ CUỐI, NẾU KỊP THÌ LÀM

### Statistics & Reports
- GET `/statistics/rescue-teams`            - Thống kê đội cứu trợ
- GET `/statistics/donations`               - Thống kê quyên góp
- GET `/statistics/requests`                - Thống kê yêu cầu



