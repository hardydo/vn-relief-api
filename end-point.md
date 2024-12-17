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
- GET `/natural-disasters/active`             - Lấy đợt thiên tai đang diễn ra

### Thông tin Thiên tai
- GET `/natural-disasters/:id/info`           - Lấy thông tin của đợt thiên tai
- POST `/natural-disasters/:id/info`          - Thêm thông tin cho đợt thiên tai
- PUT `/natural-disasters/:id/info/:infoId`   - Cập nhật thông tin
- DELETE `/natural-disasters/:id/info/:infoId` - Xóa thông tin

## Người dùng (`/users`)
- GET `/users`                               - Lấy danh sách người dùng
- GET `/users/:id`                           - Lấy chi tiết người dùng
- POST `/users`                              - Tạo người dùng mới
- PUT `/users/:id`                           - Cập nhật thông tin người dùng
- DELETE `/users/:id`                        - Xóa người dùng

### Quản lý Roles
- GET `/users/:id/roles`                     - Lấy danh sách roles của user
- POST `/users/:id/roles`                    - Thêm role cho user
- DELETE `/users/:id/roles/:roleId`          - Xóa role của user

### Tình nguyện viên
- GET `/users/volunteers`                    - Lấy danh sách TNV
- GET `/users/volunteers/by-type/:type`      - Lấy TNV theo loại 
	+ type thu_thap
	+ type Hotline
	+ type xac_minh
- POST `/users/volunteers/register`          - Đăng ký làm TNV
	+ Truyền body phải truyền type TNV đăng ký lên (thu_thap, hotline, xac_minh)
- PUT `/users/volunteers/:id/status`         - Cập nhật trạng thái TNV

### Thành viên Đội cứu trợ
- GET `/users/:id/rescue-teams`              - Lấy đội cứu trợ của user
- POST `/users/:id/rescue-teams/:teamId/join` - Xin tham gia đội
- PUT `/users/:id/rescue-teams/:teamId/leave` - Rời đội
- GET `/users/:id/leader-teams`              - Lấy đội mà user đang làm trưởng nhóm

## Đội Cứu trợ (`/rescue-teams`)
- GET `/rescue-teams`                        - Lấy danh sách đội
- GET `/rescue-teams/:id`                    - Chi tiết đội
- POST `/rescue-teams`                       - Tạo đội mới
- PUT `/rescue-teams/:id`                    - Cập nhật thông tin đội
- DELETE `/rescue-teams/:id`                 - Giải tán đội

### Quản lý Thành viên
- GET `/rescue-teams/:id/members`            - Danh sách thành viên
- POST `/rescue-teams/:id/members`           - Thêm thành viên
- DELETE `/rescue-teams/:id/members/:userId` - Xóa thành viên
- PUT `/rescue-teams/:id/leader/:userId`     - Chuyển quyền đội trưởng
- GET `/rescue-teams/:id/requests`           - Xem yêu cầu tham gia
- PUT `/rescue-teams/:id/requests/:reqId`    - Duyệt/từ chối yêu cầu

### Hoạt động Cứu trợ
- GET `/rescue-teams/:id/missions`           - Xem các nhiệm vụ cứu trợ của đội
- GET `/rescue-teams/:id/active-missions`    - Nhiệm vụ đang thực hiện
- POST `/rescue-teams/:id/missions`          - Nhận nhiệm vụ mới
- PUT `/rescue-teams/:id/missions/:missionId` - Cập nhật tiến độ cứu trợ

### Phương tiện
- GET `/rescue-teams/:id/vehicles`           - Danh sách phương tiện

## Yêu cầu Cứu trợ (`/rescue-requests`)
- GET `/rescue-requests`                     - Danh sách yêu cầu
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
- PUT `/rescue-requests/:id/status`          - Cập nhật trạng thái
	+ Chỉ đội cứu trợ mới có quyền cập nhật trạng thái
	+ Các role khác -> CHẶN
- POST `/rescue-requests/:id/team/:teamId/assign` - Phân công đội cứu trợ
	+ Cái này là TNV role xac_minh có thể phân công đơn cứu trợ cho 1 đội cứu trợ nào đó
	+ Các role khác --> CHẶN

### Chi tiết yêu cầu Hàng cứu trợ: 
#### Ví dụ hộ dân A yêu cầu xin 100 cân gạo
- GET `/rescue-requests/:id/items`           - Danh sách hàng cần
- POST `/rescue-requests/:id/items`          - Thêm hàng cần
- PUT `/rescue-requests/:id/items/:itemId`   - Cập nhật số lượng
- DELETE `/rescue-requests/:id/items/:itemId` - Xóa hàng

- GET `/rescue-requests/by-status/:status`   - Lọc theo trạng thái
- GET `/rescue-requests/by-location/:location` - Lọc theo địa điểm
- GET `/rescue-requests/urgent`              - Yêu cầu khẩn cấp
- GET `/rescue-requests/nearby`              - Yêu cầu gần đây

## Địa điểm Hỗ trợ (`/support-locations`)
- GET `/support-locations`                   - Danh sách địa điểm
- GET `/support-locations/:id`               - Chi tiết địa điểm
- POST `/support-locations`                  - Thêm địa điểm mới
- PUT `/support-locations/:id`               - Cập nhật thông tin
- DELETE `/support-locations/:id`            - Xóa địa điểm

### Theo loại địa điểm
- GET `/support-locations/by-type/:type`     - Lọc theo loại
	+ type: /rest-stops --> Điểm dừng chân
	+ type: /shelters --> Điểm tạm trú
	+ type: /collection-points --> Điểm tập kết

### Quản lý hàng hóa
- GET `/support-locations/:id/inventory`     - Kiểm kê hàng hóa
	+ Trả về hết danh sách hàng hoá của 1 "địa điểm hỗ trợ" (:id) 
- POST `/support-locations/receive`      - Nhận hàng
	+ Truyền body chứa thông tin "phương tiện" nhận hàng 
	+ Body cũng truyền vào là 1 mảng các id "hàng cứu trợ muốn đóng góp" --> Tức là nhận 1 lúc nhiều hàng để chở đi ấy
	+ Đồng thời update trạng thái của các "hàng cứu trợ muốn đóng góp" dựa vào mảng id tuyền body lên (status: Đang vận chuyển)
	+ Đồng thời update trạng thái "lich trinh van chuyen"
- POST `/support-locations/:id/rescue-requests/:id/distribute`   - Phát hàng
	+ Truyền body chứa thông tin "phương tiện" nhận hàng 
	+ Body cũng truyền vào là 1 mảng các id "hàng cứu trợ muốn đóng góp" --> Tức là phát 1 lúc nhiều hàng cho hộ dân
	+ Đồng thời update trạng thái của các "hàng cứu trợ muốn đóng góp" dựa vào mảng id tuyền body lên (status: Đang phân phát)
	+ Khi nào phát xong thì người dùng tự update trạng thái lên "Đã phân phát xong"
	+ Đồng thời update trạng thái "lich trinh van chuyen"

- GET `/support-locations/nearby/:coordinates` - Tìm "địa điểm hỗ trợ" gần nhất

## Hàng Cứu trợ (`/donation-items`): Người dân mang hàng tới "địa điểm hỗ trợ" donation
- GET `/donation-items`             		 - Danh sách hàng
- GET `/donation-items/:id`                  - Chi tiết hàng
- POST `/donation-items`                     - Thêm hàng mới
	+ Body truyền lên số điện thoại của người donation (nguoi_dung)
	+ Nếu nguoi_dung chưa có account 
		+ Thì dựa vào sđt tạo luôn 1 account với role thanh_vien_thuong 
		+ Nhớ là phải gửi mã code về sđt đó, thì mới cho tạo account --> cái này là phần Đăng ký (nghiên cứu firebase có gửi code về sđt)
- PUT `/donation-items/:id`                  - Cập nhật thông tin hàng
	+ Tăng/Giảm số lượng hàng
	+ Thêm hàng...
- DELETE `/donation-items/:id`               - Xóa hàng

## Lịch trình Vận chuyển (`/transport-schedules`)
- GET `/transport-schedules`                 - Danh sách lịch trình
- GET `/transport-schedules/:id`             - Chi tiết lịch trình
- PUT `/transport-schedules/:id`             - Cập nhật lịch trình
- DELETE `/transport-schedules/:id`          - Xóa lịch trình

## Giao dịch Tài chính (`/transactions`)
- GET `/transactions`                        - Danh sách giao dịch
- GET `/transactions/:id`                    - Chi tiết giao dịch

### Tiền mặt
- POST `/donations/cash/record`              - Ghi nhận tiền mặt
- GET `/donations/cash/history`              - Lịch sử tiền mặt
- GET `/donations/cash/statistics`           - Thống kê tiền mặt
- POST `/donations/cash/receipt`             - Xuất biên nhận

### Chuyển khoản (dùng VNPay developer)
- POST `/transactions/vnpay/create`          - Tạo giao dịch VNPAY
- POST `/transactions/vnpay/callback`        - Callback VNPAY
- POST `/transactions/cash/record`           - Ghi nhận tiền mặt
- GET `/transactions/payment-methods`        - Phương thức thanh toán

## Phương tiện (`/vehicles`)
- GET `/vehicles`                           - Danh sách phương tiện
- GET `/vehicles/:id`                       - Chi tiết phương tiện
- POST `/vehicles`                          - Đăng ký phương tiện
- PUT `/vehicles/:id`                       - Cập nhật thông tin
- DELETE `/vehicles/:id`                    - Xóa phương tiện

### Quản lý trạng thái
- PUT `/vehicles/:id/status`                - Cập nhật trạng thái
	+ `available`: Phương tiện sẵn sàng
	+ `in-use`: Phương tiện đang dùng

## System Management: ĐỂ CUỐI, NẾU KỊP THÌ LÀM
- GET `/logs`                               - Xem logs

### Notifications: ĐỂ CUỐI, NẾU KỊP THÌ LÀM

### Statistics & Reports
- GET `/statistics/rescue-teams`            - Thống kê đội cứu trợ
- GET `/statistics/donations`               - Thống kê quyên góp
- GET `/statistics/requests`                - Thống kê yêu cầu

## Tình nguyện viên (`/volunteers`)
- GET `/volunteers/:type`: Danh sách TNV theo type
	+ `all`: Get all
	+ `info-collectors`: Danh sách TNV thu thập
	+ `hotline`: Danh sách TNV hotline
	+ `verifiers`: Danh sách TNV xác minh

- POST `/volunteers/:type/register`: Đăng ký TNV
	+ `info-collectors`: Đăng ký TNV thu thập
	+ `hotline`: Đăng ký TNV hotline
	+ `verifiers`: Đăng ký TNV xác minh

========================================= CÒN 3 CÁI DƯỚI ĐANG LÀM DỞ
### TNV Thu thập thông tin
- POST `/volunteers/info-collectors/report`   - Báo cáo thông tin
- GET `/volunteers/info-collectors/tasks`     - Nhiệm vụ cần thực hiện

### TNV Hotline
- POST `/volunteers/hotline/calls`           - Ghi nhận cuộc gọi
- GET `/volunteers/hotline/schedule`         - Lịch trực hotline

### TNV Xác minh
- GET `/volunteers/verifiers/pending`        - Yêu cầu chờ xác minh
- POST `/volunteers/verifiers/verify/:id`    - Xác minh yêu cầu

