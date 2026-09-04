using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace InAnThao.Api.Data;

/// <summary>Seeds catalogue data taken from the "In An Thao" design file.</summary>
public static class DbSeeder
{
    private const string Img = "https://www.inanthao.com//admin/webroot/upload/image/images/";

    public static string Slugify(string input)
    {
        var normalized = input.ToLowerInvariant().Replace("đ", "d").Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var ch in normalized)
        {
            var cat = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (cat == UnicodeCategory.NonSpacingMark) continue;
            sb.Append(char.IsLetterOrDigit(ch) ? ch : '-');
        }
        var slug = System.Text.RegularExpressions.Regex.Replace(sb.ToString(), "-+", "-").Trim('-');
        return slug;
    }

    private static decimal ParsePrice(string label)
    {
        var digits = new string(label.Where(char.IsDigit).ToArray());
        return decimal.TryParse(digits, out var v) ? v : 0;
    }

    public static async Task SeedAsync(AppDbContext db, CancellationToken ct = default)
    {
        if (await db.Categories.AnyAsync(ct)) return;

        var categories = new List<Category>
        {
            new()
            {
                Name = "Thiệp cưới", Slug = "thiep-cuoi", SortOrder = 1, BasePrice = 4500,
                SubLabels = ["Thiệp cưới 2025", "Thiệp cưới cao cấp", "Thiệp cưới giá rẻ"],
                PaperOptions =
                [
                    new() { Label = "Giấy mỹ thuật 250gsm", Multiplier = 1m, SortOrder = 1 },
                    new() { Label = "Couche 300gsm", Multiplier = 0.82m, SortOrder = 2 },
                    new() { Label = "Kraft ngà 260gsm", Multiplier = 0.95m, SortOrder = 3 },
                ],
                Specs =
                [
                    new() { Key = "Kích thước", Value = "13 × 18 cm (gập đôi)", SortOrder = 1 },
                    new() { Key = "Số lượng tối thiểu", Value = "100 thiệp", SortOrder = 2 },
                    new() { Key = "Kèm theo", Value = "Phong bì cùng bộ", SortOrder = 3 },
                    new() { Key = "Thời gian in", Value = "3 – 5 ngày làm việc", SortOrder = 4 },
                    new() { Key = "Thiết kế", Value = "Miễn phí dàn trang nội dung", SortOrder = 5 },
                ]
            },
            new()
            {
                Name = "Tem nhãn", Slug = "tem-nhan", SortOrder = 2, BasePrice = 250,
                SubLabels = ["Decal giấy", "Decal nhựa trong", "Tem bảo hành"],
                PaperOptions =
                [
                    new() { Label = "Decal giấy", Multiplier = 1m, SortOrder = 1 },
                    new() { Label = "Decal nhựa PVC", Multiplier = 1.6m, SortOrder = 2 },
                    new() { Label = "Decal trong", Multiplier = 1.8m, SortOrder = 3 },
                ],
                Specs =
                [
                    new() { Key = "Kích thước", Value = "Theo yêu cầu, tối đa 20 cm", SortOrder = 1 },
                    new() { Key = "Số lượng tối thiểu", Value = "500 tem", SortOrder = 2 },
                    new() { Key = "Kiểu cắt", Value = "Cắt tròn / theo hình", SortOrder = 3 },
                    new() { Key = "Thời gian in", Value = "2 – 4 ngày làm việc", SortOrder = 4 },
                    new() { Key = "Thiết kế", Value = "Miễn phí chỉnh sửa file", SortOrder = 5 },
                ]
            },
            new()
            {
                Name = "Bao bì", Slug = "bao-bi", SortOrder = 3, BasePrice = 9000,
                SubLabels = ["Hộp giấy cứng", "Túi giấy", "Hộp bánh – trà"],
                PaperOptions =
                [
                    new() { Label = "Ivory 350gsm bồi carton", Multiplier = 1m, SortOrder = 1 },
                    new() { Label = "Kraft 300gsm", Multiplier = 0.86m, SortOrder = 2 },
                    new() { Label = "Duplex 400gsm", Multiplier = 1.15m, SortOrder = 3 },
                ],
                Specs =
                [
                    new() { Key = "Kích thước", Value = "Theo mẫu hoặc đặt riêng", SortOrder = 1 },
                    new() { Key = "Số lượng tối thiểu", Value = "100 hộp", SortOrder = 2 },
                    new() { Key = "Gia công", Value = "Bồi carton, dán tay", SortOrder = 3 },
                    new() { Key = "Thời gian in", Value = "5 – 7 ngày làm việc", SortOrder = 4 },
                    new() { Key = "Thiết kế", Value = "Dựng khuôn miễn phí", SortOrder = 5 },
                ]
            },
            new()
            {
                Name = "Ấn phẩm", Slug = "an-pham", SortOrder = 4, BasePrice = 18000,
                SubLabels = ["Catalogue", "Tờ rơi – Brochure", "Standee – Backdrop"],
                PaperOptions =
                [
                    new() { Label = "Couche 150gsm", Multiplier = 1m, SortOrder = 1 },
                    new() { Label = "Couche 200gsm", Multiplier = 1.18m, SortOrder = 2 },
                    new() { Label = "Giấy mỹ thuật", Multiplier = 1.35m, SortOrder = 3 },
                ],
                Specs =
                [
                    new() { Key = "Kích thước", Value = "A4 / A5", SortOrder = 1 },
                    new() { Key = "Số lượng tối thiểu", Value = "50 bản", SortOrder = 2 },
                    new() { Key = "Đóng quyển", Value = "Đóng kim hoặc keo nhiệt", SortOrder = 3 },
                    new() { Key = "Thời gian in", Value = "4 – 6 ngày làm việc", SortOrder = 4 },
                    new() { Key = "Thiết kế", Value = "Dàn trang miễn phí", SortOrder = 5 },
                ]
            },
        };

        var byName = categories.ToDictionary(c => c.Name);

        (string name, string cat, string price, string img, string desc)[] items =
        [
            ("Thiệp cưới Siêu Sale", "Thiệp cưới", "từ 1.000₫", Img + "thiep_cuoi_gia_re/ATF07b.JPG", "In offset số lượng lớn, giấy couche 250gsm — lựa chọn tiết kiệm nhất, vẫn kèm phong bì."),
            ("Thiệp cưới Hot Trend", "Thiệp cưới", "từ 4.500₫", Img + "thiep_cuoi_ATK/ATK24a_inanthao.jpg", "Mẫu đang được đặt nhiều nhất: giấy mỹ thuật, ép kim nhũ vàng, cấn bế viền."),
            ("Thiệp cưới Tự Thiết Kế", "Thiệp cưới", "từ 5.200₫", Img + "thiep_cuoi_KTS/AT_BTN01B.jpg", "Bạn gửi ý tưởng hoặc file riêng, xưởng dựng khuôn và in đúng bản duyệt."),
            ("Thiệp cưới Đẹp 2025", "Thiệp cưới", "từ 4.800₫", Img + "thiep_cuoi_2025/25A22_thiepcuoi_inanthao.jpg", "Bộ sưu tập mới nhất, phong cách hiện đại, kèm phong bì cùng bộ."),
            ("Thiệp cưới Đơn Sắc", "Thiệp cưới", "từ 3.900₫", Img + "thiep_cuoi_ATD/ATK07_KEa_thiep_cuoi_vintage_0932733764.jpg", "Một màu chủ đạo, chữ khắc mảnh — tinh giản và sang cho tiệc nhà hàng."),
            ("Thiệp cưới In Hình", "Thiệp cưới", "từ 5.500₫", Img + "thiep_cuoi_ATH/ATH02A_thiepcuoi_inanthao.jpg", "In ảnh cưới trực tiếp lên thiệp, màu chuẩn, cán mờ chống bám vân tay."),
            ("Thiệp cưới Nhã Nhặn", "Thiệp cưới", "từ 4.200₫", Img + "thiep_cuoi_ATN/ATN02B_thiepcuoi_inanthao.jpg", "Tông trung tính, hoa văn tối giản, phù hợp mọi không gian tiệc."),
            ("Thiệp cưới Chibi", "Thiệp cưới", "từ 5.000₫", Img + "thiep_cuoi_ATC/ATC01A_thiepcuioi_inanthao.JPG", "Vẽ chibi cô dâu chú rể theo ảnh thật, dễ thương và rất được yêu thích."),
            ("Tem nhãn Decal", "Tem nhãn", "từ 120₫/tem", Img + "decal_giay/decal_giay_2018_01_28_inanthao.jpg", "Decal giấy, nhựa sữa, kraft hay nhựa trong — cắt tròn hoặc theo hình."),
            ("Hộp giấy ép kim", "Bao bì", "từ 12.000₫", Img + "hop_giay/hop_giay_ep_kim_inanthao.jpg", "Bồi carton cứng, ép kim logo, dựng khuôn miễn phí theo sản phẩm của bạn."),
            ("Túi nilon – Ly nhựa", "Bao bì", "từ 1.800₫", Img + "tui_nilong/in_tui_nilong_inanthao.png", "In thương hiệu lên túi nilon, ly nhựa các loại — số lượng linh hoạt."),
            ("Name card – Voucher", "Ấn phẩm", "từ 55.000₫/hộp", Img + "name_card/namecard_20210523_inanthao_v.jpg", "Hộp 100 card, giấy 300gsm, cán mờ hoặc ép kim; kèm voucher, thẻ tích điểm."),
            ("Hóa đơn – Bao thư", "Ấn phẩm", "từ 9.000₫/cuốn", Img + "Hoa_don/hoadon_03062022_inanthao_v.jpg", "In giấy carbonless 2–3 liên, đánh số nhảy, đóng cuốn theo yêu cầu."),
            ("Phôi thiệp trơn", "Ấn phẩm", "từ 1.500₫", Img + "phoi_trang_in_thiep/00BOMAU1.jpg", "Dành cho nhà in: phôi thiệp trơn nhiều màu, nhiều phôi, giao số lượng lớn."),
            ("Menu – Catalogue", "Ấn phẩm", "từ 18.000₫", Img + "Menu/menu_quan_com_2022_03_19_inanthao.jpg.jpg", "Menu quán, catalogue sản phẩm — đóng kim hoặc keo nhiệt, dàn trang miễn phí."),
            ("Dịch vụ in khác", "Ấn phẩm", "liên hệ", Img + "khac/spkhac_inanthao.jpg", "Standee, backdrop, tờ rơi, phiếu quà tặng… gửi yêu cầu để xưởng báo giá."),
        ];

        var order = 0;
        foreach (var it in items)
        {
            byName[it.cat].Products.Add(new Product
            {
                Name = it.name,
                Slug = Slugify(it.name),
                PriceLabel = it.price,
                BasePrice = ParsePrice(it.price),
                ImageUrl = it.img,
                Description = it.desc,
                SortOrder = ++order,
            });
        }

        db.Categories.AddRange(categories);
        db.FinishOptions.AddRange(
            new FinishOption { Label = "Cán mờ", Multiplier = 1m, SortOrder = 1 },
            new FinishOption { Label = "Ép kim nhũ", Multiplier = 1.28m, SortOrder = 2 },
            new FinishOption { Label = "Cấn bế theo hình", Multiplier = 1.16m, SortOrder = 3 });

        await db.SaveChangesAsync(ct);
    }
}
