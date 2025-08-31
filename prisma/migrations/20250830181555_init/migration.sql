-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "conditions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fruits" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "glycemic_index" INTEGER NOT NULL,
    "sugar_content" DOUBLE PRECISION NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fiber" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vitamin_c" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "potassium" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fruits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fruit_restrictions" (
    "id" SERIAL NOT NULL,
    "condition" TEXT NOT NULL,
    "fruit_id" INTEGER NOT NULL,
    "restriction_level" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fruit_restrictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_plans" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "plan_data" JSONB NOT NULL,
    "explanation" TEXT NOT NULL,
    "nutritional_summary" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_fruit_selections" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "fruit_id" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "time_of_day" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_fruit_selections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "fruits_name_key" ON "fruits"("name");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_plans_user_id_week_year_key" ON "weekly_plans"("user_id", "week", "year");

-- AddForeignKey
ALTER TABLE "fruit_restrictions" ADD CONSTRAINT "fruit_restrictions_fruit_id_fkey" FOREIGN KEY ("fruit_id") REFERENCES "fruits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_plans" ADD CONSTRAINT "weekly_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_fruit_selections" ADD CONSTRAINT "user_fruit_selections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_fruit_selections" ADD CONSTRAINT "user_fruit_selections_fruit_id_fkey" FOREIGN KEY ("fruit_id") REFERENCES "fruits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
