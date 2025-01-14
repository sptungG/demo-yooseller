# Yoolife SmartSupplier Web

![image](https://res.cloudinary.com/ngoviettung154/image/upload/v1713329153/_demo/yootek/6697ed6a-c52d-4151-abd3-2351f6356bd3.png)

## Công nghệ sử dụng:

- [Nextjs Typescript](https://nextjs.org/docs) (Page Router)
- [antd v5](https://ant.design/components/overview): Xây dựng component
- [Emotion-styled](https://emotion.sh/docs/styled): Style giao diện, component
- Dayjs: Xử lý các tác vụ thời gian
- Redux: Quản lý Global State
    - [Redux Toolkit (RTK)](https://redux-toolkit.js.org/usage/usage-with-typescript): giúp dễ dàng thao tác với Redux
    - [RTK Query](https://redux-toolkit.js.org/rtk-query/overview): xử lý data-fetching với cache, query-key, đồng bộ trạng thái đc tận dụng redux-store
- [ahooks](https://ahooks.js.org/hooks/use-creation): thư viện gồm các hooks phổ biến

## Cấu trúc dự án

```graphql
.
├── src
│   ├── components
│   ├── hooks
│   ├── pages # <-- pages
│   ├── public
│   ├── redux
│   ├── styles
│   ├── types
│   └── utils
└── [..]
```

## Convention

- Dự án sử dụng `yarn`
- Sử dụng absolute import path `src/*`
    
    ```jsx
      // Import bằng absolute path ✅
      import Layout from "src/components/layout/supplierLayout";
    ```
    
- Các **page** (trang chính) sẽ được viết trong `src/pages` như document của NextJS Page Router. Lưu ý ko đc viết component trong này vì cơ chế file-base routing của Nextjs sẽ làm cho component thành 1 trang web riêng.

- Trong `src/components` chứa các component sử dụng xuyên suốt toàn trang
    - style cho component bằng `emotion-styled` thường đc đặt tên bắt đầu với `Styled___`

- Trong `src/redux` chứa các cấu hình redux
    - `src/redux/query` gồm các phương thức gọi API: query, mutate. Các query và mutate đc gắn tag để có thể tự động invalidate query, ví dụ như cập nhật xong 1 item thì tự động cập nhật danh sách item
    - `src/redux/reducer` gồm các redux slice quản lý global state
    - Lưu ý:   khi tạo mới Reducer, API xong thì cần đc cài đặt vào **`provider store`** ở `src/redux/store.ts`

- Trong `src/types` định nghĩa các type sử dụng
đặt tên `type T${type_name} = {}` để dễ dàng gợi ý từ VScode khi gõ **`T`**

- Đa ngôn ngữ (Internationalization, i18n) trong `src/types/i18n/*`
sử dụng thông qua hooks `useChangeLocale`

- Gõ `rfc-default` để đc gợi ý snippet cấu trúc code cho file với ReactTSX, EmotionStyled
đc cài đặt ở trong `./.vscode/vscode.code-snippets`

- **Lưu lại** file sẽ đc tự động format code

  Các **import** đc tự sắp xếp và đc xóa những cái ko dùng đến

- **Commit lint**:

  ```shell
  type(scope?): subject
  ```

  với:

  - `type` là mộ trong những keyword dưới (tham khảo `Angular`)

    - **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
    - **ci**: Changes to our CI configuration files and scripts (example scopes: Gitlab CI, Circle, BrowserStack, SauceLabs)
    - **chore**: add something without touching production code (Eg: update npm dependencies)
    - **docs**: Documentation only changes
    - **feat**: A new feature
    - **fix**: A bug fix
    - **perf**: A code change that improves performance
    - **refactor**: A code change that neither fixes a bug nor adds a feature
    - **revert**: Reverts a previous commit
    - **style**: Changes that do not affect the meaning of the code (Eg: adding white-space, formatting, missing semi-colons, etc)
    - **test**: Adding missing tests or correcting existing tests
      scope là optional, phạm vi ảnh hưởng của commit hiện tại

  - `subject` là nội dung của commit

  ```shell
  # VD commit khi thêm tính năng gọi API login:
  git commit -m "feat: add call API login
  ```
