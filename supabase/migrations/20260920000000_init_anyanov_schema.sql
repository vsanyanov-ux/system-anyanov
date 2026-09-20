-- ==============================================================================
-- СИСТЕМА АНЬЯНОВА (SYSTEM ANYANOV) - SUPABASE DATABASE SCHEMA
-- Прикладная социальная инженерия стиля и ольфакторная физика
-- ==============================================================================

-- 1. ТАБЛИЦА АРОМАТОВ (GLOBAL PERFUME REGISTRY)
-- Хранит все калиброванные ароматы мира, включая автопополненные пользователями
create table if not exists public.fragrances (
    id text primary key,
    brand text not null,
    name text not null,
    x_coord numeric(4, 2) not null check (x_coord >= -1.00 and x_coord <= 1.00),
    y_coord numeric(4, 2) not null check (y_coord >= -1.00 and y_coord <= 1.00),
    diffusion text not null check (diffusion in ('Интимная', 'Умеренная', 'Шлейфовая', 'Ударная')),
    pyramid jsonb not null default '{"top": [], "heart": [], "base": []}'::jsonb,
    dominant_vibe text not null,
    best_occasion text not null,
    why_fits_outfit text not null,
    color_theme text not null default 'from-amber-600 via-stone-800 to-black',
    image_url text,
    is_verified boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Индексы для сверхбыстрого пространственного и текстового поиска
create index if not exists idx_fragrances_coords on public.fragrances (x_coord, y_coord);
create index if not exists idx_fragrances_brand_name on public.fragrances (brand, name);

-- 2. ТАБЛИЦА ПОЛОК ПОЛЬЗОВАТЕЛЕЙ (USER WARDROBE SHELVES)
-- Привязывает флаконы к конкретному пользователю или анонимной сессии
create table if not exists public.user_shelves (
    id uuid default gen_random_uuid() primary key,
    user_id text not null, -- Supabase auth UID или устойчивый анонимный client_id
    fragrance_id text not null references public.fragrances(id) on delete cascade,
    added_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (user_id, fragrance_id)
);

create index if not exists idx_user_shelves_user_id on public.user_shelves (user_id);

-- 3. ТАБЛИЦА ЖУРНАЛА СИТУАЦИЙ (SITUATION DISCOVERY LOGS)
-- Фиксирует реальные жизненные запросы людей для выявления новых паттернов
create table if not exists public.situation_logs (
    id uuid default gen_random_uuid() primary key,
    query text not null,
    resolved_social_x numeric(4, 2) not null,
    resolved_thermo_y numeric(4, 2) not null,
    temperature_c numeric(4, 1),
    formal_index smallint,
    recommended_fragrance_id text references public.fragrances(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_situation_logs_created_at on public.situation_logs (created_at desc);

-- ==============================================================================
-- БЕЗОПАСНОСТЬ (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
alter table public.fragrances enable row level security;
alter table public.user_shelves enable row level security;
alter table public.situation_logs enable row level security;

-- Политики для каталога ароматов:
-- Чтение доступно всем публично (гостям и авторизованным)
create policy "Каталог ароматов доступен для чтения всем"
    on public.fragrances for select
    using (true);

-- Добавление нового аромата доступно любому пользователю (краудсорсинг)
create policy "Добавление аромата в каталог открыто для всех"
    on public.fragrances for insert
    with check (true);

-- Политики для полок пользователей:
create policy "Пользователь читает свою полку"
    on public.user_shelves for select
    using (true);

create policy "Пользователь добавляет на свою полку"
    on public.user_shelves for insert
    with check (true);

create policy "Пользователь удаляет со своей полки"
    on public.user_shelves for delete
    using (true);

-- Политики для журнала ситуаций:
create policy "Запись лога ситуации"
    on public.situation_logs for insert
    with check (true);
