# Yoolife SmartSupplier Web

## Công nghệ sử dụng:

- [Nextjs](https://nextjs.org/docs/getting-started) Typescript
- [antd](https://ant.design/components/button) xây dựng component
- [Emotion-styled](https://emotion.sh/docs/styled) style giao diện ~ scss
- [Dayjs](https://day.js.org/docs/en/display/format) xử lý các tác vụ thời gian
- [ReduxToolkit](https://redux-toolkit.js.org/tutorials/quick-start#create-a-redux-state-slice) quản lý state, theo kèm [Redux Query](https://redux-toolkit.js.org/rtk-query/usage/queries) để gọi API từ client
- [ahooks](https://ahooks.js.org/hooks/use-safe-state) xử lý các hooks phổ biến

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

  ```js
  // Import bằng absolute path ✅
  import Layout from "src/components/layout/supplierLayout";
  ```

- Các **page** (trang chính) sẽ được viết trong `src/pages` như document của `NextJS`
- Trong `src/components` chứa các component sử dụng xuyên suốt toàn trang

  component của `antd` có thể đc bọc lại và style bằng `emotion-styled`.

  component custom style bằng `emotion-styled` đặt tên tương ứng chức năng của nó `storeCard`, `siderNav`....

- Trong `src/redux/query` gòm các phương thức gọi API

  và `src/redux/reducer` gòm các redux slice quản lý state

  khi tạo mới xong thì cần đc cài đặt vào _provider store_ ở `src/redux/store.ts`

- Trong `src/types` định nghĩa các **type** sử dụng

  đặt tên `type T${type_name} = {}` để dễ dàng gợi ý từ VScode khi gõ `T`

- **Internationalization** (i18n) trong `src/types/i18n/*`

  sử dụng thông qua hooks `useChangeLocale`

- Gõ `rfc-default` để đc gợi ý snippet cấu trúc code cho file với ReactTSX, EmotionStyled

  đc cài đặt ở trong `./.vscode/vscode.code-snippets`

- **Lint** và **format** code:

  Lưu lại file sẽ đc tự động format code

  Các import đc tự sắp xếp và đc xóa những cái ko dùng đến

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
